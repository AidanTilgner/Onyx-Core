import { Router } from "express";
import path from "path";
import { config } from "dotenv";
import { initDB } from "./module/utils/surrealdb";
import { initDefaultUser } from "./module/utils/auth";
import UsersRouter from "./module/routes/users";
import AuthRouter from "./module/routes/auth";

const router = Router();

config();
initDB().then((res) => {
  initDefaultUser();
});

router.use("/api/auth", AuthRouter);
router.use("/api/users", UsersRouter);

export default router;
