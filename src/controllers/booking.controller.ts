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
      message: "Booking created successfully.",
    });
  } catch (error: any) {
    let clientMessage = "Failed to create booking.";
    const rawError = error.message || String(error);

    if (rawError.includes("overlaps")) {
      clientMessage = "This time slot overlaps with an existing reservation.";
    } else if (rawError.includes("Incorrect datetime")) {
      clientMessage = "Provided date format is invalid.";
    }

    return sendResponse(res, {
      statusCode: StatusCode.BAD_REQUEST,
      success: false,
      message: clientMessage,
      error: rawError,
    });
  }
};

export const getBookings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const bookings = await bookingService.getAllBookings();
    return sendResponse(res, { data: bookings });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to retrieve system bookings list.",
      error: error.message || String(error),
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

    return sendResponse(res, {
      data: result,
      message: "Booking deleted successfully.",
    });
  } catch (error: any) {
    const rawError = error.message || String(error);
    let statusCode = StatusCode.BAD_REQUEST;
    let clientMessage = "Could not delete booking.";

    if (rawError.includes("not found")) {
      statusCode = StatusCode.NOT_FOUND;
      clientMessage = "The requested booking could not be found.";
    } else if (rawError.includes("Forbidden")) {
      statusCode = StatusCode.FORBIDDEN;
      clientMessage =
        "Access denied: You are only allowed to delete your own bookings.";
    }

    return sendResponse(res, {
      statusCode,
      success: false,
      message: clientMessage,
      error: rawError,
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
      message: "Failed to load usage data statistics summary.",
      error: error.message || String(error),
    });
  }
};

export const getBookingsGrouped = async (
  _req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const groupedData = await bookingService.getBookingsGroupedByUser();
    return sendResponse(res, { data: groupedData });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to load bookings grouped by user.",
      error: error.message || String(error),
    });
  }
};
