import { Router } from "express";
import { getChannels, resolveChannelAction } from "./module";
import ChannelsInterfacer from "./interfacer";
import type { ChannelActionBody } from "./module/index.d";

const router = Router();

const interfacer = new ChannelsInterfacer();
const people = interfacer.people;

router.get(
  "/",
  people.useMiddleware().authenticateSuperUser,
  async (req, res) => {
    try {
      const channels = await getChannels();
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
  }
);

router.post("/:channel", async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"] as string | undefined;
    if (!apiKey) return res.status(401).send({ message: "Unauthorized" });
    const { result, code } = await resolveChannelAction(
      req.params.channel,
      req.body as ChannelActionBody,
      apiKey
    );
    if (code === 401) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }
    if (code === 404) {
      return res.status(404).send({
        message: "Not Found",
      });
    }
    if (code === 500) {
      return res.status(500).send({
        message: "Internal Server Error",
      });
    }
    return res.status(200).send({
      message: "Channel action resolved successfully",
      data: result,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

export default router;
