import { Router } from "express";
import { getChannels } from "./module";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const channels = await getChannels(req, res);
    res.status(200).send({
      message: "Channels fetched successfully",
      data: channels,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

export default router;
