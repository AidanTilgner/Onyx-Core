import { Router } from "express";
import { ChatPromptType } from "docs/openai";
import {
  getConversations,
  getConversation,
  createConversation,
  deleteConversation,
  createChatInConversation,
} from "../database/queries/conversation";
import { respondToChat } from "./converse";

const router = Router();

// all should be async with try catch
router.get("/", async (req, res) => {
  try {
    const conversations = await getConversations();
    res.send({
      message: "Success",
      data: conversations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const conversation = await getConversation(Number(req.params.id), true);
    if (!conversation) {
      res.status(404).send({ error: "Conversation not found" });
      return;
    }
    res.send({
      message: "Success",
      data: conversation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      prompt_id: req.body.prompt_id,
    };

    if (!data.name || !data.prompt_id) {
      res.status(400).send({ error: "Missing name or prompt_id" });
      return;
    }

    const conversation = await createConversation(
      data.name,
      Number(data.prompt_id)
    );
    res.send({
      message: "Success",
      data: conversation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const conversation = await deleteConversation(Number(req.params.id));
    if (!conversation) {
      res.status(404).send({ error: "Conversation not found" });
      return;
    }
    res.send({
      message: "Success",
      data: conversation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.post("/:id/chats", async (req, res) => {
  try {
    const data = {
      content: req.body.content,
      type: req.body.type,
      model: req.body.model,
    };

    if (!data.content || !data.type) {
      res.status(400).send({ error: "Missing content or type" });
      return;
    }

    if (!["system", "assistant", "user"].includes(data.type)) {
      res.status(400).send({ error: "Invalid type" });
      return;
    }

    if (
      !["gpt-4", "gpt-3.5-turbo", "gpt-3.5"].includes(data.model) &&
      data.model?.length > 0
    ) {
      res.status(400).send({ error: "Invalid model" });
      return;
    }

    const existingConversation = await getConversation(Number(req.params.id));

    if (!existingConversation) {
      res.status(404).send({ error: "Conversation not found" });
      return;
    }

    const newConversation = await respondToChat(
      data.content,
      Number(req.params.id),
      data.model || undefined
    );

    if (!newConversation) {
      res.status(500).send({ error: "Internal Server Error" });
      return;
    }

    res.send({
      message: "Success",
      data: {
        ...newConversation,
        modelUsed: data.model || "gpt-3.5-turbo",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

export default router;
