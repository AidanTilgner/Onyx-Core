import { Router } from "express";
import BloggerRouter from "./blogger/routes";

const router = Router();

router.use("/blogger", BloggerRouter);

export default router;
