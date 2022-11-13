import { Router } from "express";
import { deleteUser, disableUser, getUser } from "database/queries/users";
import { addUser, getMe, getUsers, logoutUser } from "controllers/users";
import { refreshUser, signInUser } from "controllers/users";
import { authenticateSuperUser, authenticateToken } from "middleware/auth";
import { hasRole } from "@utils/auth";
import { User } from "interfaces/users";

const router = Router();

router.post("/add", authenticateSuperUser, async (req, res) => {
  try {
    const { username } = req.body;
    const decoded = req.body.decoded_token as User;
    const role = (await hasRole(req.body.role, decoded.username))
      ? req.body.role
      : "user";
    const result = await addUser(username, role);
    res.send(result);
  } catch (err) {
    console.error(err);
    return res.send({
      error: err,
      message: "There was an error adding the user",
    });
  }
});

router.get("/", authenticateSuperUser, async (req, res) => {
  try {
    const result = await getUsers();
    res.send(result);
  } catch (err) {
    console.error(err);
    return res.send({
      error: err,
      message: "There was an error fetching the user",
    });
  }
});

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const decoded = req.body.decoded_token;
    if (typeof decoded === "string") {
      return res.send({
        error: decoded,
        message: "There was an error fetching the user",
      });
    }
    const result = await getMe(decoded);
    res.send(result);
  } catch (err) {
    console.error(err);
    return res.send({
      error: err,
      message: "There was an error fetching the user",
    });
  }
});

router.get("/:username", authenticateSuperUser, async (req, res) => {
  try {
    const username = req.params.username;
    const result = await getUser(username);
    if (result.error) {
      return res.send(result);
    }
    res.send({
      result: result.user,
      message: "User fetched successfully",
    });
  } catch (err) {
    console.error(err);
    return res.send({
      error: err,
      message: "There was an error fetching the user",
    });
  }
});

router.put("/:username/disable", authenticateSuperUser, async (req, res) => {
  try {
    const username = req.params.username;
    const result = await disableUser(username);

    if (result.error) {
      return res.send({
        error: result.error,
      });
    }

    res.send({
      result: result.result,
      message: "User disabled successfully",
    });
  } catch (err) {
    console.error(err);
    return res.send({
      error: err,
      message: "There was an error deleting the user",
    });
  }
});

router.delete("/:username", async (req, res) => {
  try {
    const username =
      req.params.username || req.body.username || req.query.username;
    const result = await deleteUser(username);
    res.send(result);
  } catch (err) {
    console.error(err);
    return res.send({
      error: err,
      message: "There was an error deleting the user",
    });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const toSend = await signInUser(username, password);
    res.send(toSend);
  } catch (err) {
    console.error(err);
    return res.send({
      error: err,
      message: "There was an error signing in the user",
    });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const { username } = req.body;
    const result = await logoutUser(username);
    res.send(result);
  } catch (err) {
    console.error(err);
    return res.send({
      error: err,
      message: "There was an error logging out the user",
    });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const { refresh_token, username } = req.body;
    const toSend = await refreshUser(refresh_token, username);
    res.send(toSend);
  } catch (err) {
    console.error(err);
    return res.send({
      error: err,
      message: "There was an error refreshing the token",
    });
  }
});

export default router;
