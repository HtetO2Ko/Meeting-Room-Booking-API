import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { BookingService } from "../services/booking.service.js";
import { sendResponse } from "../utils/response.util.js";
import { StatusCode } from "../interfaces/response.js";

const bookingService = new BookingService();

export const createBooking = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { startTime, endTime } = req.body;
    const userId = req.user!.id;
    const booking = await bookingService.createBooking(
      userId,
      startTime,
      endTime,
    );
    return sendResponse(res, {
      statusCode: StatusCode.CREATED,
      data: booking,
      message: "Booking created",
    });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: StatusCode.BAD_REQUEST,
      success: false,
      message: error.message,
    });
  }
};

// ⚡ UPDATED: Now passes the authenticated context forward
export const getBookings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const bookings = await bookingService.getAllBookings(req.user!);
    return sendResponse(res, { data: bookings });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message,
    });
  }
};

export const deleteBooking = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const result = await bookingService.deleteBooking(Number(id), req.user!);
    return sendResponse(res, { data: result, message: "Booking deleted" });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: StatusCode.BAD_REQUEST,
      success: false,
      message: error.message,
    });
  }
};

export const getSummary = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const summary = await bookingService.getUsageSummary();
    return sendResponse(res, { data: summary });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message,
    });
  }
};

export const getBookingsGrouped = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const groupedData = await bookingService.getBookingsGroupedByUser(
      req.user!,
    );
    return sendResponse(res, { data: groupedData });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message,
    });
  }
};
