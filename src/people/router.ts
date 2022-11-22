import { Router } from "express";
import path from "path";
import { config } from "dotenv";
import UsersRouter from "./module/routes/users";
import AuthRouter from "./module/routes/auth";
import PeopleInterface from "./interface";

const router = Router();

const people = new PeopleInterface();

const { initDB, initDefaultUser, initMariadb } = people;

config();
initDB().then((res) => {
  initDefaultUser();
});
initMariadb();

router.use("/api/auth", AuthRouter);
router.use("/api/users", UsersRouter);

export default router;
