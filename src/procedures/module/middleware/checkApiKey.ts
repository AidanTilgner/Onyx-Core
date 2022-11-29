import type { Request, Response, NextFunction } from "express";

import { checkApiKey as checkUtil } from "utils/apiKeys";

export const checkApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const service: string =
    (req.query.service as string) || (req.headers["x-service"] as string);
  if (!service) {
    return res.status(400).send({ message: "No service provided" });
  }
  const key: string =
    (req.query.key as string) || (req.headers["x-key"] as string);
  if (!key) {
    return res.status(400).send({ message: "No key provided" });
  }
  const check = await checkUtil(service, key);
  if (!check) {
    return res.status(401).send("Unauthorized");
  }
  next();
};
