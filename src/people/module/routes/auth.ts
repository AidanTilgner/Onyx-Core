import { Router } from "express";
import { refreshToken } from "../controllers/auth";
import { verifyToken } from "../utils/jwt";
import { User } from "../interfaces/users";

const router = Router();

router.post("/refresh", async (req, res) => {
  try {
    const { key, reset_token } = req.body;
    const toSend = await refreshToken(key, reset_token);
    res.send(toSend);
  } catch (err) {
    console.error(err);
    return res.send({
      error: err,
      message: "There was an error authenticating",
    });
  }
});

router.post("/check", async (req, res) => {
  try {
    const token =
      req.body.token || req.headers["x-access-token"] || req.query.token;
    if (!token) {
      return res.status(401).send({
        error: "No token provided",
        message: "No token provided",
        validated: false,
      });
    }
    const validated = await verifyToken(token);
    if (!validated) {
      return res.status(401).send({
        message: "Invalid token",
        validated: false,
      });
    }
    if ((validated as Partial<User>).password) {
      delete (validated as Partial<User>).password;
    }
    res.status(200).send({
      message: "Token is valid",
      validated,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      error: err,
      message: "There was an error authenticating",
    });
  }
});

export default router;
