import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from the interpretation router!");
});

export default router;