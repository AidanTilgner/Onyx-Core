import { Router } from "express";
import mappings from "../mappings";
import {
  getActionMetadata,
  addRecentAction,
  checkActionExists,
  getRecentActions,
} from "../utils";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const {
      body: { action },
    } = req as {
      body: { action: string };
    };
    if (!checkActionExists(action)) {
      return res.send({
        error: `Action "${action}" not found`,
      });
    }
    const [act, subact = "default"] = action.split(".");
    const actionResponse: Function = await mappings[act][subact](req.body);
    if (actionResponse) {
      addRecentAction(action);
    }
    return res.send({
      message: `Action "${action}" executed successfully`,
      response: actionResponse,
    });
  } catch (err) {
    console.log("Error: ", err);
  }
});

router.post("/:action", async (req, res) => {
  try {
    const {
      params: { action },
    } = req as {
      params: {
        action: string;
      };
    };
    if (!checkActionExists(action)) {
      return res.send({
        error: `Action "${action}" not found`,
      });
    }
    const [act, subact = "default"] = action.split(".");
    const actionResponse: any = await mappings[act][subact](req.body);
    if (actionResponse) {
      addRecentAction(action);
    }
    return res.send({
      message: `Action "${action}" executed successfully`,
      response: actionResponse,
    });
  } catch (err) {
    console.log("Error: ", err);
  }
});

router.get("/", (req, res) => {
  const mappingsCopy: { [key: string]: string[] } = {};
  Object.keys(mappings).forEach((key) => {
    mappingsCopy[key] = Object.keys(mappings[key]);
  });
  res.send({
    message: "Successfully got actions",
    actions: mappingsCopy,
  });
});

router.get("/recent", (req, res) => {
  res.send({
    message: "Successfully got recent actions",
    actions: getRecentActions(),
  });
});

router.get("/:action", (req, res) => {
  const {
    params: { action },
  } = req;
  const [act, subact = "default"] = action.split(".");
  if (!mappings[act]?.[subact]) {
    return res.send({
      error: `Action "${action}" not found`,
    });
  }
  return res.send({
    message: "Action exists",
    response: mappings[act][subact],
  });
});

router.get("/metadata/:action", (req, res) => {
  const {
    params: { action },
  } = req;
  const metadata = getActionMetadata(action);
  if (!metadata) {
    return res.send({
      message: `No metadata found for the action "${action}"`,
      response: {},
    });
  }
  return res.send({
    message: `Successfully got metadata for the action "${action}"`,
    response: metadata,
  });
});

export default router;
