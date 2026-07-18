import type { GroupedData } from "../interfaces/booking.interface.js";
import { BookingRepository } from "../repositories/booking.repository.js";

const bookingRepository = new BookingRepository();

export class BookingService {
  async createBooking(userId: number, startTime: string, endTime: string) {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    const formatToMySQL = (date: Date) => {
      return date.toISOString().slice(0, 19).replace("T", " ");
    };

    const mysqlStartTime = formatToMySQL(startDate);
    const mysqlEndTime = formatToMySQL(endDate);

    const isOverlapping = await bookingRepository.hasOverlap(
      mysqlStartTime,
      mysqlEndTime,
    );
    if (isOverlapping) {
      throw new Error("Booking slot overlaps with an existing reservation.");
    }

    const id = await bookingRepository.create(
      userId,
      mysqlStartTime,
      mysqlEndTime,
    );

    return { id, userId, startTime: mysqlStartTime, endTime: mysqlEndTime };
  }

  async getAllBookings() {
    return await bookingRepository.findAll();
  }

  async deleteBooking(
    bookingId: number,
    requestingUser: { id: number; role: string },
  ) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) throw new Error("Booking deletion failed: Booking not found");

    if (
      requestingUser.role === "user" &&
      booking.userId !== requestingUser.id
    ) {
      throw new Error("Forbidden: You can only delete your own bookings.");
    }

    await bookingRepository.delete(bookingId);
    return { id: bookingId };
  }

  async getUsageSummary() {
    return await bookingRepository.getSummary();
  }

  async getBookingsGroupedByUser() {
    const rawBookings = await bookingRepository.findAllWithUserNames();

    const grouped = rawBookings.reduce((acc: GroupedData, curr) => {
      const { userId, userName, bookingId, startTime, endTime } = curr;

      if (!acc[userId]) {
        acc[userId] = {
          userId,
          userName,
          bookings: [],
        };
      }

      acc[userId].bookings.push({
        id: bookingId,
        startTime,
        endTime,
      });

      return acc;
    }, {});

    return Object.values(grouped);
  }
}
