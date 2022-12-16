import { Entity } from "../index.d";
import { NLUResponse } from "../index.d";

export const extractAndAddSpecialEntities = (nlu: NLUResponse) => {
  const matches: Entity[] = [];
  entitiesToExtract.forEach((entity) => {
    entity.regex.forEach((regex) => {
      const match = regex.exec(nlu.initial_input);
      if (match) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          len: match[0].length,
          accuracy: 1,
          sourceText: match[0],
          utteranceText: match[0],
          entity: entity.type,
          option: match[1],
          resolution: {},
        });
      }
    });
  });
  nlu.entities = [...nlu.entities, ...matches];
  return nlu;
};

export const findSpecialEntities = (text: string) => {
  const matches: Entity[] = [];
  entitiesToExtract.forEach((entity) => {
    entity.regex.forEach((regex) => {
      const match = regex.exec(text);
      if (match) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          len: match[0].length,
          accuracy: 1,
          sourceText: match[0],
          utteranceText: match[0],
          entity: entity.type,
          option: match[1],
          resolution: {},
        });
      }
    });
  });
  return matches;
};

const entitiesToExtract = [
  {
    type: "name",
    regex: [
      /My name is ([\w\s]+)/g,
      /I am ([\w\s]+)/g,
      /I'm ([\w\s]+)/g,
      /I am called ([\w\s]+)/g,
      /I'm called ([\w\s]+)/g,
      /Call me ([\w\s]+)/g,
    ],
  },
  {
    type: "user_message",
    regex: [
      // my message is ...,
      // say ...
      // tell <name> ...
      // tell <name> to ...
      /My message is ([\w\s]+)/g,
      /Say ([\w\s]+)/g,
      /Tell ([\w\s]+) ([\w\s]+)/g,
      /Tell ([\w\s]+) to ([\w\s]+)/g,
    ],
  },
];
