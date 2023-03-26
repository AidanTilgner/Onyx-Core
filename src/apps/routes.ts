import { Router } from "express";
import BloggerRouter from "./blogger/routes";
import GPTRouter from "./OnyxGPT/routes";

const router = Router();

router.use("/blogger", BloggerRouter);
router.use("/gpt", GPTRouter);

export default router;
