import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError";

export function errorMiddleware(
  err: any,
  request: Request,
  response: Response,
  _: NextFunction
) {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: "Error",
      code: err.statusCode,
      message: err.message,
    });
  }
  console.log(err);

  return response.status(500).json({
    status: "Error",
    code: 500,
    message: "Internal server error",
  });
}
