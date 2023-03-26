import { Router } from "express";
import ConversationRoutes from "./application/conversations/routes";
import PromptRoutes from "./application/prompts/routes";

const router = Router();

router.get("/", (req, res) => {
  res.send({
    message: "Welcome to Onyx-GPT!",
  });
});

router.use("/conversations", ConversationRoutes);
router.use("/prompts", PromptRoutes);

export default router;
