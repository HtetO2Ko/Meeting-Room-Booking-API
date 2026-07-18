import pool from "../configs/db.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import type { IBooking } from "../interfaces/booking.interface.js";

export class BookingRepository {
  async hasOverlap(startTime: string, endTime: string): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id FROM booking 
       WHERE (? < endTime) AND (? > startTime)`,
      [startTime, endTime],
    );
    return rows.length > 0;
  }

  async create(
    userId: number,
    startTime: string,
    endTime: string,
  ): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO booking (userId, startTime, endTime) VALUES (?, ?, ?)",
      [userId, startTime, endTime],
    );
    return result.insertId;
  }

  async findAll(): Promise<IBooking[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM booking ORDER BY startTime ASC",
    );
    return rows as IBooking[];
  }

  async findByUserId(userId: number): Promise<IBooking[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM booking WHERE userId = ? ORDER BY startTime ASC",
      [userId],
    );
    return rows as IBooking[];
  }

  async findById(id: number): Promise<IBooking | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM booking WHERE id = ?",
      [id],
    );
    if (rows.length === 0) return null;
    return rows[0] as IBooking;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM booking WHERE id = ?",
      [id],
    );
    return result.affectedRows > 0;
  }

  async getSummary(): Promise<any[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT u.id as userId, u.name, COUNT(b.id) as totalBookings 
       FROM user u 
       LEFT JOIN booking b ON u.id = b.userId 
       GROUP BY u.id`,
    );
    return rows;
  }

  async findAllWithUserNames(): Promise<any[]> {
    const [rows] = await pool.query(
      `SELECT 
      b.id as bookingId, 
      b.startTime, 
      b.endTime, 
      u.id as userId, 
      u.name as userName
     FROM booking b
     INNER JOIN user u ON b.userId = u.id
     ORDER BY u.name ASC, b.startTime ASC`,
    );
    return rows as any[];
  }
}
