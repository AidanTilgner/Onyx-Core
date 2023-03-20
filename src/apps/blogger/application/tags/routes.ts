import { Router } from "express";
import {
  getTags,
  createTag,
  updateTag,
  deleteTag,
  getPostsByTag,
  getTag,
} from "../database/queries/tags";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const tags = await getTags();
    res.send({
      message: "Tags retrieved successfully",
      data: tags,
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
    const tag = await getTag(id);
    if (!tag) {
      res.status(404).send({
        message: "Tag not found",
      });
      return;
    }
    res.send({
      message: "Tag retrieved successfully",
      data: tag,
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
    const { name, description } = req.body;
    const tag = await createTag(name, description);

    res.send({
      message: "Tag created successfully",
      data: tag,
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
    const id = Number(req.params.id);
    const update = {
      name: req.body.name,
      description: req.body.description,
    };
    if (!update.name || !update.description) {
      res.status(400).send({
        message: "Bad Request",
      });
      return;
    }
    const updated = await updateTag(id, req.body);

    if (!updated) {
      res.status(404).send({
        message: "Tag not found",
      });
      return;
    }

    res.send({
      message: "Tag updated successfully",
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
    const deleted = await deleteTag(id);
    if (!deleted) {
      res.status(404).send({
        message: "Tag not found",
      });
      return;
    }
    res.send({
      message: "Tag deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

router.get("/:id/posts", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const posts = await getPostsByTag(id);

    if (!posts) {
      res.status(404).send({
        message: "Tag not found",
      });
      return;
    }

    res.send({
      message: "Posts retrieved successfully",
      data: posts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

export default router;
