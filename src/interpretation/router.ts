import { Router } from "express";
import NLURouter from "./routes/nlu";
import TrainingRouter from "./routes/training";

const router = Router();

router.use("/api/nlu", NLURouter);
router.use("/api/training", TrainingRouter);

export default router;
