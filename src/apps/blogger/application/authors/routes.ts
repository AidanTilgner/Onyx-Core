import { Router } from "express";
import {
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  getAuthor,
} from "../database/queries/author";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const authors = await getAuthors();
    res.send({
      message: "Authors retrieved successfully",
      data: authors,
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
    const author = await getAuthor(id);
    if (!author) {
      res.status(404).send({
        message: "Author not found",
      });
      return;
    }
    res.send({
      message: "Author retrieved successfully",
      data: author,
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
    if (!name) {
      res.status(400).send({
        message: "Bad Request",
      });
      return;
    }

    const author = await createAuthor({ name, description });

    res.send({
      message: "Author created successfully",
      data: author,
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
    if (!update.name) {
      res.status(400).send({
        message: "Bad Request",
      });
      return;
    }
    const author = await updateAuthor(id, update);

    if (!author) {
      res.status(404).send({
        message: "Author not found",
      });
      return;
    }

    res.send({
      message: "Author updated successfully",
      data: author,
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
    const author = await deleteAuthor(id);

    if (!author) {
      res.status(404).send({
        message: "Author not found",
      });
      return;
    }

    res.send({
      message: "Author deleted successfully",
      data: author,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

export default router;
