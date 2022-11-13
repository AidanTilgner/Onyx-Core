import Express from "express";
import { config } from "dotenv";

config();

const { PORT } = process.env;
const app = Express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Onyx listening at port: ${PORT}`);
});
