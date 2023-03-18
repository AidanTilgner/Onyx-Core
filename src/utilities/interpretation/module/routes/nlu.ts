import { Router } from "express";
import { getNLUData } from "../nlp/nlu";

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
  const nlu = await getNLUData(text, session_id, language);
  res.send({
    message: "Successfully classified input",
    nlu: nlu,
  });
});

export default router;
