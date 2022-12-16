import { Router } from "express";
import {
  getTrainingData,
  addResponseToAction,
  addActionToIntent,
  addIntentToText,
  changeIntentForText,
  changeActionForIntent,
  removeActionFromIntent,
  removeResponseFromAction,
  removeAsExample,
  getExistingActions,
  getExistingActionsWithoutResponse,
} from "../docs";
import { restartNLP } from "../index";
import { config } from "dotenv";
import InterpretationInterfacer from "../../interfacer";

config();

const interfacer = new InterpretationInterfacer();

const router = Router();

router.get("/", async (req, res) => {
  const trainingData = await getTrainingData();
  return res.send({
    message: "Successfully retrieved NLU data",
    data: trainingData,
  });
});

router.post("/train", async (req, res) => {
  try {
    await restartNLP();
    return res.send({
      message: "Successfully trained NLU model",
      trained: "1",
    });
  } catch (err) {
    return res.send({
      message: "Error while training",
      error: err,
      trained: "0",
    });
  }
});

router.post("/intent", (req, res) => {
  const { text, intent, language } = req.body;
  return res.send(addIntentToText(text, intent, language));
});

router.post("/action", async (req, res) => {
  const { intent, action } = req.body;
  return res.send(addActionToIntent(intent, action));
});

router.post("/response", (req, res) => {
  const { action, response } = req.body;
  return res.send(addResponseToAction(action, response));
});

router.put("/intent", (req, res) => {
  const { text, intent, language } = req.body;
  return res.send(changeIntentForText(text, intent, language));
});

router.put("/action", (req, res) => {
  const { intent, action } = req.body;
  return res.send(changeActionForIntent(intent, action));
});

router.delete("/action", (req, res) => {
  const { intent } = req.body;
  return res.send(removeActionFromIntent(intent));
});

router.delete("/response", (req, res) => {
  const { action, response } = req.body;
  return res.send(removeResponseFromAction(action, response));
});

router.delete("/example", (req, res) => {
  const { text } = req.body;
  return res.send(removeAsExample(text));
});

router.get("/actions/supported", async (req, res) => {
  try {
    const actions = await interfacer.actionsInterface.getActions();

    return res.send({
      actions: actions,
      message: "Successfully retrieved supported actions",
    });
  } catch (err) {
    return res.send({
      error: "There was a problem getting the supported actions.",
    });
  }
});

router.get("/actions/existing", (req, res) => {
  return res.send({
    actions: getExistingActions(),
    message: "Successfully retrieved existing actions",
  });
});

router.get("/actions/without-response", (req, res) => {
  return res.send({
    actions: getExistingActionsWithoutResponse(),
    message: "Successfully retrieved existing actions without response",
  });
});

export default router;
