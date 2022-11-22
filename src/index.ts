import Express from "express";
import { config } from "dotenv";
import InterpretationRouter from "./interpretation/router";
import ActionsRouter from "./actions/router";
import PeopleRouter from "./people/router";
import InterpretationInterface from "./interpretation/interface";
import ProcedureRouter from "./procedures/router";

const interpretation = new InterpretationInterface();

config();
interpretation.initNLU();

const { PORT } = process.env;
const app = Express();

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to the Onyx API, feel free to explore!");
});

app.use("/interpretation", InterpretationRouter);
app.use("/actions", ActionsRouter);
app.use("/people", PeopleRouter);
app.use("/procedures", ProcedureRouter);

app.listen(PORT, () => {
  console.info(`Onyx listening at port: ${PORT}`);
});
