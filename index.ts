import Express from "express";
import { config } from "dotenv";
import InterpretationRouter from "./interpretation/router";

config();

const { PORT } = process.env;
const app = Express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/interpretation", InterpretationRouter);

app.listen(PORT, () => {
  console.log(`Onyx listening at port: ${PORT}`);
});
