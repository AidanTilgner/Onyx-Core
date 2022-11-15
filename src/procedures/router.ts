import { Router } from "express";
import { useProcedure } from "./module";

const router = Router();

router.post("/:procedure", async (req, res) => {
  try {
    const { args } = req.body;
    const procedureRes = await useProcedure(req.params.procedure, ...args);
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

export default router;
