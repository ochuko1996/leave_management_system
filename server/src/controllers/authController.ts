import { Request, Response } from 'express';
import { UserModel, User } from '../models/user.model';
import { comparePassword, generateToken } from '../utils/auth';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const userData: User = req.body;

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const existingStaffId = await UserModel.findByStaffId(userData.staff_id);
      if (existingStaffId) {
        return res.status(400).json({ message: 'Staff ID already registered' });
      }

      // Create new user
      const user = await UserModel.create(userData);
      
      // Generate token
      const token = generateToken({
        id: user.id!,
        staff_id: user.staff_id,
        email: user.email,
        role: user.role
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      res.status(201).json({
        message: 'User registered successfully',
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Error registering user' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Find user
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken({
        id: user.id!,
        staff_id: user.staff_id,
        email: user.email,
        role: user.role
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        message: 'Login successful',
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error during login' });
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      res.json({
        message: 'Profile retrieved successfully',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Error retrieving profile' });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const updateData = req.body;
      const success = await UserModel.update(userId, updateData);

      if (!success) {
        return res.status(400).json({ message: 'No valid fields to update' });
      }

      const updatedUser = await UserModel.findById(userId);
      const { password, ...userWithoutPassword } = updatedUser!;

      res.json({
        message: 'Profile updated successfully',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Error updating profile' });
    }
  }
} 