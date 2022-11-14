import { verifyToken } from "../utils/jwt";
import type { Request, Response, NextFunction } from "express";
import { tokenHasRole } from "../utils/auth";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] ||
      req.query.token ||
      req.body.token;
    const decoded = await verifyToken(token);
    if (!decoded) {
      return res.status(401).send({
        message: "Invalid token",
        validated: false,
      });
    }
    req.body.decoded_token = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.send({
      error: err,
      message: "There was an error authenticating the user",
    });
  }
};

export const authenticateSuperUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] ||
      req.query.token ||
      req.body.token;
    const decoded = await verifyToken(token);
    if (!decoded) {
      return res.status(401).send({
        message: "Invalid token",
        validated: false,
      });
    }
    if (
      typeof decoded !== "string" &&
      (await tokenHasRole("superuser", decoded))
    ) {
      return res.status(401).send({
        message: "You are not authorized to access this resource",
      });
    }
    req.body.decoded_token = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).send({
      error: err,
      message: "There was an error authenticating the user",
    });
  }
};

export const authenticateHyperUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] ||
      req.query.token ||
      req.body.token;
    const decoded = await verifyToken(token);
    if (!decoded) {
      return res.status(401).send({
        message: "Invalid token",
        validated: false,
      });
    }
    if (
      typeof decoded !== "string" &&
      (await tokenHasRole("hyperuser", decoded))
    ) {
      return res.status(401).send({
        message: "You are not authorized to access this resource",
      });
    }
    req.body.decoded_token = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).send({
      error: err,
      message: "There was an error authenticating the user",
    });
  }
};
