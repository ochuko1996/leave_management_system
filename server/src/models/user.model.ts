import pool from "../config/database";
import { hashPassword } from "../utils/auth";

export interface User {
  id?: number;
  staff_id: string;
  full_name: string;
  email: string;
  password: string;
  department: string;
  role: "staff" | "hod" | "dean" | "admin";
  created_at?: Date;
  updated_at?: Date;
}

export class UserModel {
  static async create(
    user: Omit<User, "id" | "created_at" | "updated_at">
  ): Promise<User> {
    const hashedPassword = await hashPassword(user.password);
    const timestamp = Date.now().toString().slice(-6);
    const rolePrefix = user.role.toUpperCase().slice(0, 2);
    const staff_id = `${rolePrefix}${timestamp}`;

    const [result] = await pool.execute(
      `INSERT INTO users (full_name, email, password, department, role, staff_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        user.full_name,
        user.email,
        hashedPassword,
        user.department,
        user.role,
        staff_id,
      ]
    );
    console.log(result);
    const insertResult = result as any;
    return { ...user, id: insertResult.insertId };
  }

  static async findById(id: number): Promise<User | null> {
    const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);
    const users = rows as User[];
    return users[0] || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const users = rows as User[];
    return users[0] || null;
  }

  static async findByStaffId(staffId: string): Promise<User | null> {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE staff_id = ?",
      [staffId]
    );
    const users = rows as User[];
    return users[0] || null;
  }

  static async update(id: number, data: Partial<User>): Promise<boolean> {
    const allowedFields = [
      "first_name",
      "last_name",
      "email",
      "department",
      "role",
    ];
    const updates = Object.keys(data)
      .filter((key) => allowedFields.includes(key))
      .map((key) => `${key} = ?`);

    if (updates.length === 0) return false;

    const values = updates.map(
      (field) => data[field.split(" ")[0] as keyof User]
    );

    const [result] = await pool.execute(
      `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
      [...values, id]
    );

    const updateResult = result as any;
    return updateResult.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [id]);

    const deleteResult = result as any;
    return deleteResult.affectedRows > 0;
  }

  static async findByDepartment(department: string): Promise<User[]> {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE department = ?",
      [department]
    );
    return rows as User[];
  }

  static async findByRole(role: string): Promise<User[]> {
    const [rows] = await pool.execute("SELECT * FROM users WHERE role = ?", [
      role,
    ]);
    return rows as User[];
  }
}
