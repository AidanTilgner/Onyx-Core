import { Router } from "express";
import ActionsRouter from "./module/routes/actions";
import ActionsInterfacer from "./interfacer";

const interfacer = new ActionsInterfacer();

const checkToken = interfacer.peopleInterface.useMiddleware().authenticateToken;
const router = Router();

router.use("/api/actions", checkToken, ActionsRouter);

export default router;
