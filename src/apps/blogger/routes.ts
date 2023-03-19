import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send({
    message: "Welcome to the Blogger API",
  });
});

export default router;
