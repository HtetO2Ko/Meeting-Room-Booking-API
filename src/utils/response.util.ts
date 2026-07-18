import type { Response } from "express";
import { StatusCode } from "../interfaces/response.js";

export const sendResponse = (
  res: Response,
  {
    statusCode = StatusCode.SUCCESS,
    success = true,
    message = "Success",
    data = null,
    error = null,
  }: {
    statusCode?: StatusCode;
    success?: boolean;
    message?: string;
    data?: unknown;
    error?: unknown;
  },
) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
    error: process.env.NODE_ENV === "production" ? null : error,
  });
};
