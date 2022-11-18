import { Router } from "express";
import { getNLUData } from "../module/nlp/nlu";

const router = Router();

const generateRandomSessionId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

router.post("/", async (req, res) => {
  const { text, language = "en" } = req.body;
  const session_id =
    req.body.session_id || req.query.session_id || generateRandomSessionId();
  const nlu = await getNLUData(session_id, text, language);
  res.send({
    message: "Successfully classified input",
    nlu: nlu,
  });
});

router.post("/unstable", async (req, res) => {
  const { text, language } = req.body;
  const session_id =
    req.body.session_id || req.query.session_id || generateRandomSessionId();
  const nlu = await getNLUData(session_id, text, language || "en");
  res.send({
    message: "Successfully classified input",
    nlu: nlu,
  });
});

export default router;
