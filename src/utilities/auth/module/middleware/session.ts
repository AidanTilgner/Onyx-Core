import { NextFunction, Request, Response } from "express";
import { manager } from "../sessions";

export const trackSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const username =
      req.body.username ||
      req.body.decoded_token?.username ||
      req.headers["x-username"];
    const session_id = req.headers["x-session-id"] as string | undefined;

    const session = session_id
      ? manager.getSession(session_id) ||
        (await manager.getOrCreateSessionFromUsername(username))
      : await manager.getOrCreateSessionFromUsername(username);

    if (!session) {
      return res.status(401).send({
        message: "Invalid username",
        validated: false,
      });
    }

    req.body.session = session;
    res.setHeader("x-session-id", session.getId());
    next();
  } catch (err) {
    console.error(err);
    return res.send({
      error: err,
      message: "There was an error tracking the session.",
    });
  }
};
