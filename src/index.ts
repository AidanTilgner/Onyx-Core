import Express from "express";
import { config } from "dotenv";
import InterpretationRouter from "./interpretation/router";
import ActionsRouter from "./actions/router";
import PeopleRouter from "./people/router";

config();

const { PORT } = process.env;
const app = Express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/interpretation", InterpretationRouter);
app.use("/actions", ActionsRouter);
app.use("/people", PeopleRouter);

app.listen(PORT, () => {
  console.log(`Onyx listening at port: ${PORT}`);
});
