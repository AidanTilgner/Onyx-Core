import { Router } from "express";
import { CustomSessionData } from "libs/session";
import BotInterfacer from "./interfacer";
import AppRoutes from "apps/routes";
const interfacer = new BotInterfacer();
const { auth } = interfacer;

const router = Router();

router.get("/", auth.useMiddleware().authenticateToken, (req, res) => {
  const { user_id } = req.session as unknown as CustomSessionData;
  console.log("User: ", user_id);
  res.send({
    message: "This is Onyx, how may I help you?",
  });
});

router.use("/apps", auth.useMiddleware().authenticateToken, AppRoutes);

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

    if (!data?.user) {
      return res.status(500).send({
        message: "Internal Server Error",
      });
    }

    (req.session as unknown as CustomSessionData).user_id = data.user.id;
    (req.session as unknown as CustomSessionData).username = data.user.username;
    req.session.save((err) => {
      if (err) {
        console.error(err);
        return res.status(500).send({
          message: "Internal Server Error",
        });
      }
    });

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

router.post("/authenticate/as_user/refresh", async (req, res) => {
  try {
    const { username, refresh_token } = req.body;
    if (!username || !refresh_token) {
      return res.status(400).send({
        message: "Bad Request, credentials not provided",
      });
    }

    const loginData = await auth.refreshAsUser(username, refresh_token);
    const { data, error, message } = loginData;
    if (error) {
      return res.status(401).send({
        message,
        error,
      });
    }

    if (!data?.user) {
      return res.status(500).send({
        message: "Internal Server Error",
      });
    }

    (req.session as unknown as CustomSessionData).user_id = data.user.id;
    (req.session as unknown as CustomSessionData).username = data.user.username;

    req.session.save((err) => {
      if (err) {
        console.error(err);
        return res.status(500).send({
          message: "Internal Server Error",
        });
      }
    });

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

router.get(
  "/me/as_user",
  auth.useMiddleware().authenticateToken,
  async (req, res) => {
    try {
      const { username } = req.session as unknown as CustomSessionData;
      const userData = await auth.me(username);
      const { data, error, message } = userData;
      if (error) {
        return res.status(401).send({
          message,
          error,
        });
      }

      if (!data) {
        return res.status(500).send({
          message: "Internal Server Error",
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
  }
);

router.post("/logout/as_user", async (req, res) => {
  try {
    const { username } = req.session as unknown as CustomSessionData;
    auth.logoutAsUser(username);
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(500).send({
          message: "Internal Server Error",
        });
      }
    });
    return res.send({
      message: "Logout successful",
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

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).send({
        message: "Bad Request, message not provided",
      });
    }

    res.send({
      message: "Received message",
      data: {
        response: "This is Onyx, I have received your message!",
      },
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
