import { body, param } from "express-validator";
import { handleValidationErrors } from "./validation.middleware.js";

export const validateCreateBooking = [
  body("startTime")
    .trim()
    .notEmpty()
    .withMessage("Start time is required")
    .isISO8601()
    .withMessage(
      "Start time must be a valid ISO 8601 timestamp (e.g., YYYY-MM-DDTHH:mm:ssZ)",
    )
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error("Start time must be in the future");
      }
      return true;
    }),

  body("endTime")
    .trim()
    .notEmpty()
    .withMessage("End time is required")
    .isISO8601()
    .withMessage("End time must be a valid ISO 8601 timestamp")
    .custom((value, { req }) => {
      const start = new Date(req.body.startTime);
      const end = new Date(value);

      if (isNaN(start.getTime())) {
        throw new Error(
          "Cannot validate End Time because Start Time is invalid",
        );
      }

      if (end <= start) {
        throw new Error(
          "End time must be chronologically after the start time",
        );
      }
      return true;
    }),

  handleValidationErrors,
];

export const validateBookingIdParam = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Booking ID must be a valid positive integer"),

  handleValidationErrors,
];
