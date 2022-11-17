import { Router } from "express";
import { getSimpleResponse } from "interpretation/module/nlp/chat";
import { createSession } from "../module/utils/sessions";

const router = Router();

router.post("/", async (req, res) => {
  const message: string = req.body.message || req.query.message;

  if (!message) {
    return res.status(400).json({
      error: "Bad Request",
      message: "You must provide a message to interpret",
    });
  }

  const session_id: string =
    req.body.session_id ||
    req.query.session_id ||
    req.headers["x-session-id"] ||
    createSession().id;

  const data = await getSimpleResponse(message, session_id);

  return res.status(200).json(data);
});

export default router;
