import { Router } from "express";
import NLURouter from "./module/routes/nlu";
import TrainingRouter from "./module/routes/training";
import ChatRouter from "./module/routes/chat";
import InterpretationInterfacer from "./interfacer";
import Express from "express";

const interfacer = new InterpretationInterfacer();
const router = Router();

const checkToken = interfacer.peopleInterface.useMiddleware().authenticateToken;

const isDev = process.env.NODE_ENV === "development";

if (isDev) {
  console.info("In development mode, allowing training UI");
  router.use(Express.static("public_interpretation"));
}

router.use("/api/nlu", checkToken, NLURouter);
router.use("/api/chat", checkToken, ChatRouter);
router.use("/api/training", checkToken, TrainingRouter);

export default router;
