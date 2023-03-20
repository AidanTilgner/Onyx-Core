import { Router } from "express";
import {
  createExampleReader,
  deleteExampleReader,
  getExampleReader,
  getExampleReaders,
  updateExampleReader,
} from "../database/queries/reader";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const readers = await getExampleReaders();
    res.send({
      message: "Readers retrieved successfully",
      data: readers,
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
    const reader = await getExampleReader(id);
    if (!reader) {
      res.status(404).send({
        message: "Reader not found",
      });
      return;
    }
    res.send({
      message: "Reader retrieved successfully",
      data: reader,
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
    const reader = {
      name: req.body.name,
      description: req.body.description,
      occupation: req.body.occupation,
    };

    if (!reader.name || !reader.description || !reader.occupation) {
      res.status(400).send({
        message: "Invalid request",
      });
      return;
    }

    const newReader = await createExampleReader(reader);

    if (!newReader) {
      res.status(500).send({
        message: "Internal Server Error",
      });
      return;
    }

    res.send({
      message: "Reader created successfully",
      data: newReader,
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
      occupation: req.body.occupation,
    };

    if (!update.name || !update.description || !update.occupation) {
      res.status(400).send({
        message: "Invalid request",
      });
      return;
    }

    const updated = await updateExampleReader(id, update);

    if (!updated) {
      res.status(500).send({
        message: "Internal Server Error",
      });
      return;
    }

    res.send({
      message: "Reader updated successfully",
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
    const deleted = await deleteExampleReader(id);
    if (!deleted) {
      res.status(500).send({
        message: "Internal Server Error",
      });
      return;
    }
    res.send({
      message: "Reader deleted successfully",
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
