import { Router } from "express";
import ActionsRouter from "./module/routes/actions";

const router = Router();

router.use("/api/actions", ActionsRouter);

export default router;
