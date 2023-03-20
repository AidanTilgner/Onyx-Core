import { Router } from "express";
import {
  addTagToPost,
  createPost,
  deletePost,
  getPost,
  getPosts,
  removeTagFromPost,
} from "../database/queries/posts";
import { generateInitialArticle, generatePost } from "./posts";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const posts = await getPosts();
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

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const post = await getPost(id);
    if (!post) {
      res.status(404).send({
        message: "Post not found",
      });
      return;
    }
    res.send({
      message: "Post retrieved successfully",
      data: post,
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
    const post = {
      title: req.body.title,
      content: req.body.content,
      description: req.body.description,
      state: req.body.state,
      author: req.body.author,
      filename: req.body.filename,
    };

    const created = await createPost(post);

    if (!created) {
      res.status(400).send({
        message: "Bad Request",
      });
      return;
    }

    res.send({
      message: "Post created successfully",
      data: created,
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
    const deleted = await deletePost(id);
    if (!deleted) {
      res.status(404).send({
        message: "Post not found",
      });
      return;
    }
    res.send({
      message: "Post deleted successfully",
      data: deleted,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

router.post("/generate", async (req, res) => {
  try {
    const info = {
      title: req.body.title,
      description: req.body.description,
      importantPoints: req.body.important_points,
      exampleReader: req.body.example_reader,
      initialPrompt: req.body.initial_prompt,
      author: req.body.author,
    };

    if (
      !info.title ||
      !info.description ||
      !info.importantPoints ||
      !info.exampleReader ||
      !info.initialPrompt ||
      !info.author
    ) {
      res.status(400).send({
        message: "Bad Request",
      });
      return;
    }

    const generated = await generatePost(info);

    if (!generated) {
      res.status(400).send({
        message: "Bad Request",
      });
      return;
    }

    res.send({
      message: "Post generated successfully",
      data: generated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

router.post("/:id/tag/:tag_id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const tagId = parseInt(req.params.tag_id);
    const post = await addTagToPost(postId, tagId);
    if (!post) {
      res.status(400).send({
        message: "Bad Request",
      });
      return;
    }
    res.send({
      message: "Tag added successfully",
      data: post,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

router.delete("/:id/tag/:tag_id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const tagId = parseInt(req.params.tag_id);
    const post = await removeTagFromPost(postId, tagId);
    if (!post) {
      res.status(400).send({
        message: "Bad Request",
      });
      return;
    }
    res.send({
      message: "Tag removed successfully",
      data: post,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

export default router;
