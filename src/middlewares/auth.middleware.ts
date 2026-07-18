import type { Request, Response, NextFunction } from "express";
import { sendResponse } from "../utils/response.util.js";
import { StatusCode } from "../interfaces/response.js";
import pool from "../configs/db.js";
import type { RowDataPacket } from "mysql2";

export interface AuthenticatedRequest extends Request {
  user?: { id: number; name: string; role: "admin" | "owner" | "user" };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.headers["x-user-id"];

  if (!userId) {
    return sendResponse(res, {
      statusCode: StatusCode.UNAUTHORIZED,
      success: false,
      message: "Authentication required. Pass 'x-user-id' in headers.",
    });
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, role FROM user WHERE id = ?",
      [userId],
    );

    const userRow = rows[0];

    if (!userRow) {
      return sendResponse(res, {
        statusCode: StatusCode.UNAUTHORIZED,
        success: false,
        message: "User not found.",
      });
    }

    req.user = {
      id: userRow.id,
      name: userRow.name,
      role: userRow.role as "admin" | "owner" | "user",
    };

    next();
  } catch (error) {
    return sendResponse(res, {
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Authentication error",
      error,
    });
  }
};

export const authorize = (roles: ("admin" | "owner" | "user")[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendResponse(res, {
        statusCode: StatusCode.FORBIDDEN,
        success: false,
        message:
          "Forbidden: You do not have permission to perform this action.",
      });
    }
    next();
  };
};
