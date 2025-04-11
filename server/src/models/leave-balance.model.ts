import db from "../config/database";
import { ApiError } from "../utils/ApiError";

interface LeaveBalance {
  id?: number;
  user_id: number;
  leave_type_id: number;
  days_remaining: number;
  created_at?: Date;
  updated_at?: Date;
}

export class LeaveBalanceModel {
  static async findByUserId(userId: number) {
    try {
      const [rows] = await db.execute(
        `SELECT lb.*, lt.name as leave_type
         FROM leave_balances lb
         JOIN leave_types lt ON lb.leave_type_id = lt.id
         WHERE lb.user_id = ?`,
        [userId]
      );
      return rows;
    } catch (error) {
      console.error("Error fetching leave balances:", error);
      throw new ApiError(500, "Failed to fetch leave balances");
    }
  }

  static async update(userId: number, typeId: number, days: number) {
    try {
      await db.execute(
        `INSERT INTO leave_balances (user_id, leave_type_id, days_remaining)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE
         days_remaining = ?,
         updated_at = CURRENT_TIMESTAMP`,
        [userId, typeId, days, days]
      );

      const [rows] = await db.execute(
        `SELECT lb.*, lt.name as leave_type, lt.default_days
         FROM leave_balances lb
         JOIN leave_types lt ON lb.leave_type_id = lt.id
         WHERE lb.user_id = ? AND lb.leave_type_id = ?`,
        [userId, typeId]
      );
      return (rows as any[])[0];
    } catch (error) {
      console.error("Error updating leave balance:", error);
      throw new ApiError(500, "Failed to update leave balance");
    }
  }

  static async deductLeaveBalance(
    userId: number,
    typeId: number,
    days: number
  ) {
    try {
      await db.execute(
        `UPDATE leave_balances
         SET days_remaining = days_remaining - ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ? AND leave_type_id = ? AND days_remaining >= ?`,
        [days, userId, typeId, days]
      );

      const [rows] = await db.execute(
        `SELECT lb.*, lt.name as leave_type, lt.default_days
         FROM leave_balances lb
         JOIN leave_types lt ON lb.leave_type_id = lt.id
         WHERE lb.user_id = ? AND lb.leave_type_id = ?`,
        [userId, typeId]
      );
      return (rows as any[])[0];
    } catch (error) {
      console.error("Error deducting leave balance:", error);
      throw new ApiError(500, "Failed to deduct leave balance");
    }
  }

  static async initializeBalance(userId: number) {
    try {
      // Get all leave types
      const [leaveTypes] = await db.execute("SELECT * FROM leave_types");

      // Initialize balance for each leave type
      for (const type of leaveTypes as any[]) {
        await this.update(userId, type.id, type.default_days);
      }

      return this.findByUserId(userId);
    } catch (error) {
      console.error("Error initializing leave balances:", error);
      throw new ApiError(500, "Failed to initialize leave balances");
    }
  }
}
