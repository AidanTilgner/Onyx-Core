import { Router } from "express";
import {
  createPrompt,
  updatePrompt,
  deletePrompt,
  getPrompt,
  getPrompts,
} from "../database/queries/prompt";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const prompts = await getPrompts();
    res.send({
      message: "Success",
      data: prompts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const prompt = await getPrompt(Number(req.params.id));
    if (!prompt) {
      res.status(404).send({ error: "Prompt not found" });
      return;
    }
    res.send({
      message: "Success",
      data: prompt,
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
      type: req.body.type,
      content: req.body.content,
    };

    if (!data.name || !data.type || !data.content) {
      res.status(400).send({ error: "Missing name, type, or content" });
      return;
    }

    const prompt = await createPrompt(data.name, data.type, data.content);

    if (!prompt) {
      res.status(500).send({ error: "Internal Server Error" });
      return;
    }

    res.send({
      message: "Success",
      data: prompt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      type: req.body.type,
      content: req.body.content,
    };

    if (!["system", "user", "assistant"].includes(data.type)) {
      res.status(400).send({ error: "Invalid type" });
      return;
    }

    const prompt = await updatePrompt(Number(req.params.id), {
      name: data.name,
      type: data.type,
      content: data.content,
    });
    if (!prompt) {
      res.status(404).send({ error: "Prompt not found" });
      return;
    }
    res.send({
      message: "Success",
      data: prompt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const prompt = await deletePrompt(Number(req.params.id));
    if (!prompt) {
      res.status(404).send({ error: "Prompt not found" });
      return;
    }
    res.send({
      message: "Success",
      data: prompt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

export default router;
