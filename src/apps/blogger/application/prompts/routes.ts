import {
  createPrompt,
  deletePrompt,
  getPrompt,
  getPrompts,
  updatePrompt,
} from "../database/queries/prompt";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const prompts = await getPrompts();
    res.send({
      message: "Prompts retrieved successfully",
      data: prompts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const prompt = await getPrompt(id);
    if (!prompt) {
      res.status(404).send({
        message: "Prompt not found",
      });
      return;
    }
    res.send({
      message: "Prompt retrieved successfully",
      data: prompt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const prompt = {
      title: req.body.title,
      content: req.body.content,
      type: req.body.type,
    };

    if (!prompt.title || !prompt.content || !prompt.type) {
      res.status(400).send({
        message: "Invalid request",
      });
      return;
    }
    if (!["system", "assistant", "user"].includes(prompt.type)) {
      res.status(400).send({
        message: "Invalid prompt type",
      });
      return;
    }

    const created = await createPrompt(prompt);

    if (!created) {
      res.status(400).send({
        message: "Invalid request",
      });
      return;
    }

    res.send({
      message: "Prompt created successfully",
      data: created,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const update = {
      title: req.body.title,
      content: req.body.content,
      type: req.body.type,
    };

    if (!update.title || !update.content || !update.type) {
      res.status(400).send({
        message: "Invalid request",
      });
      return;
    }
    if (!["system", "assistant", "user"].includes(update.type)) {
      res.status(400).send({
        message: "Invalid prompt type",
      });
      return;
    }

    const id = Number(req.params.id);

    const updated = await updatePrompt(id, update);
    res.send({
      message: "Prompt updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deleted = await deletePrompt(id);
    if (!deleted) {
      res.status(404).send({
        message: "Prompt not found",
      });
      return;
    }

    res.send({
      message: "Prompt deleted successfully",
      data: deleted,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

export default router;
