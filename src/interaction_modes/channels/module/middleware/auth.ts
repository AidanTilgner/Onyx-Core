import { Request, Response, NextFunction } from "express";
import {
  channelHasAppPermission,
  channelHasCorrectAPIKey,
} from "../permissions";

export const verifyChannel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const apiKey = req.headers["x-api-key"] as string | undefined;
    const channel = req.params.channel;

    if (!apiKey) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }

    const hasCorrectAPIKey = await channelHasCorrectAPIKey(channel, apiKey);

    if (!hasCorrectAPIKey) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }

    req.body.api_key_verified = true;

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

export const verifyChannelAppPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const apiKey = req.headers["x-api-key"] as string | undefined;
    const channel = req.params.channel;
    const app = req.headers["x-requested-app"] as string | undefined;

    if (!apiKey) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }

    if (!app) {
      return res.status(401).send({
        message: "Unauthorized, please specify app.",
      });
    }

    const hasCorrectAPIKey = req.body.api_key_verified;

    if (!hasCorrectAPIKey) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }

    const hasAppPermission = await channelHasAppPermission(channel, app);

    if (!hasAppPermission) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
