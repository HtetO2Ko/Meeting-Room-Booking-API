import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { UserService } from "../services/user.service.js";
import { sendResponse } from "../utils/response.util.js";
import { StatusCode } from "../interfaces/response.js";

const userService = new UserService();

export const createUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, role } = req.body;
    const user = await userService.createUser(name, role);

    return sendResponse(res, {
      statusCode: StatusCode.CREATED,
      data: user,
      message: "User created successfully.",
    });
  } catch (error: any) {
    let clientMessage = "Failed to create user account.";
    const rawError = error.message || String(error);

    if (error.code === "ER_DUP_ENTRY" || rawError.includes("Duplicate entry")) {
      clientMessage = "Duplicate name";
    }

    return sendResponse(res, {
      statusCode: StatusCode.BAD_REQUEST,
      success: false,
      message: clientMessage,
      error: rawError,
    });
  }
};

export const getUsers = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    return sendResponse(res, { data: users });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to retrieve user accounts database streams.",
      error: error.message || String(error),
    });
  }
};

export const changeUserRole = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await userService.updateUserRole(Number(id), role);

    return sendResponse(res, {
      data: user,
      message: "Role updated successfully.",
    });
  } catch (error: any) {
    const rawError = error.message || String(error);
    let statusCode = StatusCode.BAD_REQUEST;
    let clientMessage = "Could not alter user authorization group settings.";

    if (rawError.includes("not found")) {
      statusCode = StatusCode.NOT_FOUND;
      clientMessage =
        "The user target record could not be found to change roles.";
    }

    return sendResponse(res, {
      statusCode,
      success: false,
      message: clientMessage,
      error: rawError,
    });
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(Number(id));

    return sendResponse(res, {
      message: "User and their bookings deleted successfully.",
    });
  } catch (error: any) {
    const rawError = error.message || String(error);
    let statusCode = StatusCode.BAD_REQUEST;
    let clientMessage = "Failed to remove user context file block components.";

    if (rawError.includes("not found")) {
      statusCode = StatusCode.NOT_FOUND;
      clientMessage = "The user target record could not be found to delete.";
    }

    return sendResponse(res, {
      statusCode,
      success: false,
      message: clientMessage,
      error: rawError,
    });
  }
};
