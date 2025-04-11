import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { LeaveBalanceModel } from "../models/leave-balance.model";
import { comparePassword, generateToken } from "../utils/auth";

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const user = await UserModel.create(userData);
      // Initialize leave balances for the new user
      await LeaveBalanceModel.initializeBalance(user.id!);

      const { password, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error registering user" });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findByEmail(email);
      if (!user || !(await comparePassword(password, user.password))) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }
      const token = generateToken(user);
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      res.status(500).json({ message: "Error during login" });
    }
  }

  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserModel.findById(req.user!.id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Error fetching profile" });
    }
  }

  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const success = await UserModel.update(req.user!.id, req.body);
      if (!success) {
        res.status(400).json({ message: "Update failed" });
        return;
      }
      const user = await UserModel.findById(req.user!.id);
      const { password, ...userWithoutPassword } = user!;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Error updating profile" });
    }
  }
}
