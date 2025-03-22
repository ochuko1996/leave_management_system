import db from "../config/database";
import { ApiError } from "../utils/ApiError";

interface LeaveType {
  id?: number;
  name: string;
  description: string;
  default_days: number;
  created_at?: Date;
  updated_at?: Date;
}

export class LeaveTypeModel {
  static async create(
    data: Omit<LeaveType, "id" | "created_at" | "updated_at">
  ) {
    try {
      const [result] = await db.execute(
        `INSERT INTO leave_types (name, description, default_days)
         VALUES (?, ?, ?)`,
        [data.name, data.description, data.default_days]
      );

      const id = (result as any).insertId;
      return this.findById(id);
    } catch (error) {
      throw new ApiError(500, "Failed to create leave type");
    }
  }

  static async findAll() {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM leave_types ORDER BY name ASC"
      );
      return rows;
    } catch (error) {
      throw new ApiError(500, "Failed to fetch leave types");
    }
  }

  static async findById(id: number) {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM leave_types WHERE id = ?",
        [id]
      );
      return (rows as any[])[0] || null;
    } catch (error) {
      throw new ApiError(500, "Failed to fetch leave type");
    }
  }

  static async update(id: number, data: Partial<LeaveType>) {
    try {
      const updates: string[] = [];
      const values: any[] = [];

      if (data.name) {
        updates.push("name = ?");
        values.push(data.name);
      }
      if (data.description) {
        updates.push("description = ?");
        values.push(data.description);
      }
      if (data.default_days) {
        updates.push("default_days = ?");
        values.push(data.default_days);
      }

      if (updates.length === 0) {
        return this.findById(id);
      }

      values.push(id);

      await db.execute(
        `UPDATE leave_types SET ${updates.join(
          ", "
        )}, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        values
      );

      return this.findById(id);
    } catch (error) {
      throw new ApiError(500, "Failed to update leave type");
    }
  }

  static async delete(id: number) {
    try {
      await db.execute("DELETE FROM leave_types WHERE id = ?", [id]);
      return true;
    } catch (error) {
      throw new ApiError(500, "Failed to delete leave type");
    }
  }
}
