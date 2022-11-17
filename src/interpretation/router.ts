import { Router } from "express";
import NLURouter from "./routes/nlu";
import TrainingRouter from "./routes/training";
import ChatRouter from "./routes/chat";

const router = Router();

router.use("/api/nlu", NLURouter);
router.use("/api/chat", ChatRouter);
router.use("/api/training", TrainingRouter);

export default router;
