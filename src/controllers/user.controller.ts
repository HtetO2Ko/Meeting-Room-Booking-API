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
      message: "User created",
    });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: StatusCode.BAD_REQUEST,
      success: false,
      message: error.message,
    });
  }
};

export const getUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    return sendResponse(res, { data: users });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message,
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
    return sendResponse(res, { data: user, message: "Role updated" });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: StatusCode.BAD_REQUEST,
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(Number(id));
    return sendResponse(res, {
      message: "User and their bookings deleted successfully",
    });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: StatusCode.BAD_REQUEST,
      success: false,
      message: error.message,
    });
  }
};
