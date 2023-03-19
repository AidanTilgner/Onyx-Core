import Express from "express";
import { config } from "dotenv";
import session from "libs/session";
import cors from "cors";
import DataSourceInterface from "utilities/datasource/interface";
import ActionsInterface from "utilities/actions/interface";
import InterpretationInterface from "utilities/interpretation/interface";

import "reflect-metadata";

// * Interaction Modes
import BotRoutes from "interaction_modes/bot/routes";
import ChannelRoutes from "interaction_modes/channels/routes";

const datasource = new DataSourceInterface();
const interpretation = new InterpretationInterface();
const actions = new ActionsInterface();

config();

datasource.initDB().then(() => {
  console.info("Database initialized.");
});

interpretation.initNLU().then(() => {
  console.info("NLU initialized.");
});

actions.initActions().then(() => {
  console.info("Actions initialized.");
});

const spaURL = process.env.SPA_URL || "";

const { PORT } = process.env;
const app = Express();

const corsOptions = {
  origin: spaURL,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.use(session);

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to Onyx Core.",
  });
});

app.use("/bot", BotRoutes);
app.use("/channels", ChannelRoutes);

app.listen(PORT, () => {
  console.info(`Onyx listening at port: ${PORT}`);
});
