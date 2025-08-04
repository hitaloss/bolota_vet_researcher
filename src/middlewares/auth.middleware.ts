import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

import { AppError } from "../errors/appError";

function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  let token = request.headers.authorization;
  if (!token) throw new AppError(403, "Missing authorization headers");
  token = token.split(" ")[1];

  jwt.verify(
    token,
    process.env.SECRET_KEY as string,
    (error: any, decoded: any) => {
      if (error) throw new AppError(403, "Invalid token");

      request.user = {
        userId: decoded.sub,
      };

      next();
    }
  );
}

export default authMiddleware;
