import Express from "express";
import { config } from "dotenv";
import InterpretationRouter from "./interpretation/router";
import ActionsRouter from "./actions/router";
import PeopleRouter from "./people/router";
import InterpretationInterface from "./interpretation/interface";
import ProcedureRouter from "./procedures/router";
import Channels from "./channels/router";
import session from "express-session";

const interpretation = new InterpretationInterface();

config();
interpretation.initNLU();

const { PORT } = process.env;
const app = Express();

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to Onyx Core.",
  });
});

app.use("/interpretation", InterpretationRouter);
app.use("/actions", ActionsRouter);
app.use("/people", PeopleRouter);
app.use("/procedures", ProcedureRouter);
app.use("/channels", Channels);

app.listen(PORT, () => {
  console.info(`Onyx listening at port: ${PORT}`);
});
