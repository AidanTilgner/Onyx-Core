import { Router } from "express";
import { useProcedure, triggerActionFromActionString } from "./module";
import { checkApiKey } from "./module/middleware/checkApiKey";
import ProcedureInterfacer from "./interfacer";
const router = Router();

const interfacer = new ProcedureInterfacer();

router.post("/procedure/:procedure", async (req, res) => {
  try {
    const { args } = req.body;
    const procedureRes = await useProcedure(
      req.params.procedure,
      ...(typeof args === "string" ? JSON.parse(args) : args)
    );
    if (!procedureRes) {
      return res.status(404).send("Procedure not found");
    }
    const toSend = {
      success: true,
      data: procedureRes,
    };

    return res.status(200).send(toSend);
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      error: err,
    });
  }
});

router.post("/trigger/:action_string", checkApiKey, async (req, res) => {
  const exists = interfacer.actionsInterface.checkActionExists(
    req.params.action_string
  );
  if (!exists) {
    return res.status(404).send({ message: "Trigger not found" });
  }
  const { args } = req.body;
  const procedureRes = await triggerActionFromActionString(
    req.params.action_string,
    ...args
  );
  if (!procedureRes) {
    return res
      .status(500)
      .send({ message: "Something went wrong with the procedure" });
  }
  const toSend = {
    success: procedureRes,
  };

  return res.status(200).send(toSend);
});

export default router;
