import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { sendResponse } from "../utils/response.util.js";
import { StatusCode } from "../interfaces/response.js";

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(res, {
      statusCode: StatusCode.BAD_REQUEST,
      success: false,
      message: "Validation Error",
      error: errors.array().map((err) => ({
        field: err.type === "field" ? err.path : err.type,
        message: err.msg,
      })),
    });
  }
  next();
};
