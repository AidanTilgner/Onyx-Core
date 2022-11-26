import { Router } from "express";
import NLURouter from "./routes/nlu";
import TrainingRouter from "./routes/training";
import ChatRouter from "./routes/chat";
import InterpretationInterfacer from "./interfacer";

const interfacer = new InterpretationInterfacer();
const router = Router();

const checkToken = interfacer.peopleInterface.useMiddleware().authenticateToken;

router.use("/api/nlu", checkToken, NLURouter);
router.use("/api/chat", checkToken, ChatRouter);
router.use("/api/training", checkToken, TrainingRouter);

export default router;
