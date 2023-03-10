import { Router } from "express";
import { getSimpleResponse } from "interpretation/module/nlp/chat";
import { createSession } from "../utils/sessions";

const router = Router();

router.post("/", async (req, res) => {
  const message: string = req.body.message || req.query.message;

  if (!message) {
    return res.status(400).json({
      error: "Bad Request",
      message: "You must provide a message to interpret",
    });
  }

  const peopleSession = await req.body.session;

  const session_id: string = peopleSession.id;
  const user_id: number = peopleSession.user_id;

  const data = await getSimpleResponse(message, session_id, user_id);

  return res.status(200).json({
    session_id,
    data,
  });
});

export default router;
