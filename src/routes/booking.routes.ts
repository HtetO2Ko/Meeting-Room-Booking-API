import { Router } from "express";
import {
  createBooking,
  getBookings,
  deleteBooking,
  getSummary,
  getBookingsGrouped,
} from "../controllers/booking.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import {
  validateCreateBooking,
  validateBookingIdParam,
} from "../middlewares/booking.validation.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize(["admin", "owner", "user"]),
  validateCreateBooking,
  createBooking,
);
router.get("/", authorize(["admin", "owner", "user"]), getBookings);
router.get("/grouped", authorize(["admin", "owner"]), getBookingsGrouped);
router.get("/summary", authorize(["admin", "owner"]), getSummary);

router.delete(
  "/:id",
  authorize(["admin", "owner", "user"]),
  validateBookingIdParam,
  deleteBooking,
);

export default router;
