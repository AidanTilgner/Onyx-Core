import { Router } from "express";
import TagRoutes from "./application/tags/routes";
import AuthorRoutes from "./application/authors/routes";
import PostRoutes from "./application/posts/routes";
import PromptRoutes from "./application/prompts/routes";
import ReaderRoutes from "./application/readers/routes";

const router = Router();

router.get("/", (req, res) => {
  res.send({
    message: "Welcome to the Blogger API",
  });
});

router.use("/tags", TagRoutes);
router.use("/authors", AuthorRoutes);
router.use("/posts", PostRoutes);
router.use("/prompts", PromptRoutes);
router.use("/readers", ReaderRoutes);

export default router;
