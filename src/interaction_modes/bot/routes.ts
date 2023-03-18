import { Router } from "express";
import BotInterfacer from "./interfacer";

const interfacer = new BotInterfacer();
const { auth } = interfacer;

const router = Router();

router.get("/", auth.useMiddleware().authenticateToken, (req, res) => {
  res.send({
    message: "This is Onyx, how may I help you?",
  });
});

router.post("/authenticate/as_user", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send({
        message: "Bad Request, credentials not provided",
      });
    }

    const loginData = await auth.loginAsUser(username, password);
    const { data, error, message } = loginData;
    if (error) {
      return res.status(401).send({
        message,
        error,
      });
    }

    return res.send({
      message,
      data,
    });
  } catch (err) {
    console.error(err);
    return res
      .send({
        message: "Internal Server Error",
      })
      .status(500);
  }
});

export default router;
