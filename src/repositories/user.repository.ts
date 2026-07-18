import pool from "../configs/db.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import type { IUser, UserRole } from "../interfaces/user.interface.js";

export class UserRepository {
  async create(name: string, role: UserRole): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO user (name, role) VALUES (?, ?)",
      [name, role],
    );
    return result.insertId;
  }

  async findAll(): Promise<IUser[]> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM user");
    return rows as IUser[];
  }

  async findById(id: number): Promise<IUser | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM user WHERE id = ?",
      [id],
    );
    if (rows.length === 0) return null;
    return rows[0] as IUser;
  }

  async updateRole(id: number, role: UserRole): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE user SET role = ? WHERE id = ?",
      [role, id],
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM user WHERE id = ?",
      [id],
    );
    return result.affectedRows > 0;
  }
}
