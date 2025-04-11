import db from "../config/database";
import { ApiError } from "../utils/ApiError";

interface LeaveRequest {
  id?: number;
  user_id: number;
  leave_type_id: number;
  start_date: Date;
  end_date: Date;
  reason: string;
  status: "pending" | "approved" | "rejected";
  created_at?: Date;
  updated_at?: Date;
}

export class LeaveModel {
  static async create(
    data: Omit<LeaveRequest, "id" | "created_at" | "updated_at">
  ) {
    try {
      const [result] = await db.execute(
        `INSERT INTO leave_requests (user_id, leave_type_id, start_date, end_date, reason, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          data.user_id,
          data.leave_type_id,
          data.start_date,
          data.end_date,
          data.reason,
          data.status,
        ]
      );

      const id = (result as any).insertId;
      return this.findById(id);
    } catch (error) {
      console.log(error);

      throw new ApiError(500, "Failed to create leave request");
    }
  }

  static async findAll() {
    try {
      const [rows] = await db.execute(
        `SELECT lr.*, u.full_name, lt.name as leave_type
         FROM leave_requests lr
         JOIN users u ON lr.user_id = u.id
         JOIN leave_types lt ON lr.leave_type_id = lt.id
         ORDER BY lr.created_at DESC`
      );
      return rows;
    } catch (error) {
      throw new ApiError(500, "Failed to fetch leave requests");
    }
  }

  static async findByUserId(userId: number) {
    try {
      const [rows] = await db.execute(
        `SELECT lr.*, lt.name as leave_type
         FROM leave_requests lr
         JOIN leave_types lt ON lr.leave_type_id = lt.id
         WHERE lr.user_id = ?
         ORDER BY lr.created_at DESC`,
        [userId]
      );
      return rows;
    } catch (error) {
      throw new ApiError(500, "Failed to fetch user's leave requests");
    }
  }

  static async findById(id: number) {
    try {
      const [rows] = await db.execute(
        `SELECT lr.*, u.full_name, lt.name as leave_type
         FROM leave_requests lr
         JOIN users u ON lr.user_id = u.id
         JOIN leave_types lt ON lr.leave_type_id = lt.id
         WHERE lr.id = ?`,
        [id]
      );
      return (rows as any[])[0] || null;
    } catch (error) {
      throw new ApiError(500, "Failed to fetch leave request");
    }
  }

  static async update(id: number, data: Partial<LeaveRequest>) {
    try {
      const updates: string[] = [];
      const values: any[] = [];

      if (data.status) {
        updates.push("status = ?");
        values.push(data.status);
      }
      if (data.reason) {
        updates.push("reason = ?");
        values.push(data.reason);
      }

      if (updates.length === 0) {
        return this.findById(id);
      }

      values.push(id);

      await db.execute(
        `UPDATE leave_requests SET ${updates.join(
          ", "
        )}, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        values
      );

      return this.findById(id);
    } catch (error) {
      throw new ApiError(500, "Failed to update leave request");
    }
  }

  static async delete(id: number) {
    try {
      await db.execute("DELETE FROM leave_requests WHERE id = ?", [id]);
      return true;
    } catch (error) {
      throw new ApiError(500, "Failed to delete leave request");
    }
  }
}
