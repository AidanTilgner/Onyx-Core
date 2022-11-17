import { NlpManager } from "node-nlp";
import { Entity, TextToIntent, MetaData, NLUResponse } from "../index.d";
import text_to_intent_json from "../documents/text_to_intent.json";
import intent_to_action_json from "../documents/intent_to_action.json";
import action_to_response_json from "../documents/action_to_response.json";
import entities_json from "../documents/entities.json";
import nlu_config from "../documents/config.json";
import { spellCheckText } from "../similarity/spellcheck";
import { writeFileSync } from "fs";
import {
  generateExistingActions,
  generateExistingActionsWithoutResponse,
} from "../documents";
import {
  getActionExpectedEntities,
  checkOpensFormAndOpenIfNecessary,
  getSessionQuestions,
  checkCompletesFields,
} from "./forms";
import { dockStart } from "@nlpjs/basic";

export let manager: NlpManager = null;
export const initModel = async () => {
  const dock = await dockStart({
    use: ["Basic", "LangEn"],
    settings: {
      nlp: {
        forceNER: true,
        languages: ["en"],
      },
      log: false, // TODO: Figure out where to disable logging on epochs
    },
    locales: ["en"],
  });
  manager = dock.get("nlp");
};

export const trainModel = async () => {
  try {
    const text_to_intent: TextToIntent = text_to_intent_json;
    const entities = entities_json;

    const intentsList: string[] = [];
    text_to_intent.forEach((item) => {
      const { text, intent, language = nlu_config.defaultLanguage } = item;
      if (!intentsList.includes(intent)) {
        intentsList.push(intent);
      }
      manager.addDocument(language, text, intent);
    });

    Object.keys(entities).forEach((entity) => {
      // TODO: Add support for regex and other NE types
      entities[entity].options.forEach(
        (option: { name: string; examples: string[]; language: string }) => {
          manager.addNerRuleOptionTexts(
            option.language || nlu_config.defaultLanguage,
            entity,
            option.name,
            option.examples
          );
        }
      );
    });

    await manager.train();

    const timestamp = new Date().getTime();
    const filename = `models/model-${timestamp}.json`;
    // ! Right now there's no point in saving this because it trains every load. However, this is how it would be done, and in production we might want to load from the saved version.
    // manager.save(filename);
    // TODO: Get this from the path instead of hardcoding it
    const list_intents = `src/interpretation/module/documents/intents.json`;
    writeFileSync(list_intents, JSON.stringify(intentsList));
    console.log("Trained");
    return manager;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const testModel = async () => {
  try {
    console.log("Testing model...");
    const language = nlu_config.defaultLanguage;
    const tests = [
      {
        try: "Hello",
        expected: "greeting.hello",
      },
      {
        try: "Hi",
        expected: "greeting.hello",
      },
      {
        try: "How are you?",
        expected: "inquiry.how_are_you",
      },
      {
        try: "What is the weather like?",
        expected: "faq.weather",
      },
    ];
    tests.forEach(async (test) => {
      try {
        const { try: text } = test;
        const intent = await manager.process(language, text);
        if (intent.hasOwnProperty("nluAnswer")) {
          console.assert(
            intent.nluAnswer?.classifications[0].intent === test.expected,
            "Error in test: ",
            test,
            "Expected: ",
            test.expected,
            "Got: ",
            intent.nluAnswer?.classifications[0].intent
          );
          console.assert(
            intent.nluAnswer?.classifications[0].score > 0,
            "Error in test: ",
            test,
            "Expected non-zero score"
          );
          return;
        }
        console.assert(
          intent.classifications[0].intent === test.expected,
          "Error in test: ",
          test,
          "Expected: ",
          test.expected,
          "Got: ",
          intent.classifications[0].intent
        );
      } catch (err) {
        console.log(err);
      }
    });
    console.log("Model tested");
  } catch (err) {
    console.error(err);
  }
};

export const generateMetaData = () => {
  generateExistingActions();
  generateExistingActionsWithoutResponse();
};
