import { Request, Response, NextFunction } from "express";
import { LeaveModel } from "../models/leave.model";
import { LeaveTypeModel } from "../models/leave-type.model";
import { LeaveBalanceModel } from "../models/leave-balance.model";
import { ApiError } from "../utils/ApiError";

export class LeaveController {
  // Leave Request Methods
  static async createLeaveRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { leave_type_id, start_date, end_date, reason } = req.body;
      const user_id = req.user?.id;

      if (!user_id) {
        throw new ApiError(401, "Unauthorized");
      }

      // Check for department leave conflicts
      const departmentConflicts =
        await LeaveModel.checkDepartmentLeaveConflicts(
          user_id,
          start_date,
          end_date
        );

      // If there are conflicts, reject the leave request
      if (departmentConflicts.hasConflict) {
        return res.status(409).json({
          success: false,
          message: `Cannot approve leave request. Another employee from your department (${departmentConflicts.department}) already has approved leave during this period.`,
          conflicts: departmentConflicts.conflicts,
        });
      }

      const leaveRequest = await LeaveModel.create({
        user_id,
        leave_type_id,
        start_date,
        end_date,
        reason,
        status: "pending",
      });

      if (leaveRequest.affectedRows !== 0) {
        return res.status(201).json({
          success: true,
          message: "Leave request created successfully",
          data: leaveRequest,
        });
      }
      throw new ApiError(400, "Failed to create leave request");
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getLeaveRequests(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      console.log("Fetching leave requests...");
      const user_id = req.user?.id;
      const role = req.user?.role;

      // Add delay to prevent resource exhaustion (optional - remove in production)
      await new Promise((resolve) => setTimeout(resolve, 500));

      let leaveRequests;

      if (role === "admin" || role === "hod" || role === "dean") {
        // Admins, HODs, and Deans can see all leave requests
        leaveRequests = await LeaveModel.findAll();
      } else {
        // Staff can only see their own leave requests
        leaveRequests = await LeaveModel.findByUserId(user_id!);
      }

      // Use optional chaining to safely access length
      const requestCount = (leaveRequests as any[])?.length || 0;
      console.log(`Successfully fetched ${requestCount} leave requests`);

      return res.status(200).json({
        success: true,
        message: "Leave requests retrieved successfully",
        data: leaveRequests,
      });
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      if (error instanceof ApiError) {
        return next(error);
      }
      return next(new ApiError(500, "Failed to retrieve leave requests"));
    }
  }

  static async getLeaveRequestById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const user_id = req.user?.id;
      const role = req.user?.role;

      if (!user_id) {
        throw new ApiError(401, "Unauthorized");
      }

      const leaveRequest = await LeaveModel.findById(parseInt(id));

      if (!leaveRequest) {
        throw new ApiError(404, "Leave request not found");
      }

      // Check if user has permission to view this request
      if (
        role !== "admin" &&
        role !== "hod" &&
        leaveRequest.user_id !== user_id
      ) {
        throw new ApiError(403, "Forbidden");
      }

      return res.json({
        success: true,
        data: leaveRequest,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateLeaveRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;
      const user_id = req.user?.id;
      const role = req.user?.role;

      if (!user_id) {
        throw new ApiError(401, "Unauthorized");
      }

      const leaveRequest = await LeaveModel.findById(parseInt(id));

      if (!leaveRequest) {
        throw new ApiError(404, "Leave request not found");
      }

      // Only admins and HODs can update status
      if (status && role !== "admin" && role !== "hod") {
        throw new ApiError(403, "Forbidden");
      }

      // Users can only update their own requests
      if (
        leaveRequest.user_id !== user_id &&
        role !== "admin" &&
        role !== "hod"
      ) {
        throw new ApiError(403, "Forbidden");
      }

      // If approving the leave request, check for department conflicts
      if (status === "approved" && leaveRequest.status !== "approved") {
        // Check for department leave conflicts
        const departmentConflicts =
          await LeaveModel.checkDepartmentLeaveConflicts(
            leaveRequest.user_id,
            leaveRequest.start_date,
            leaveRequest.end_date
          );

        // If there are conflicts, reject the approval
        if (departmentConflicts.hasConflict) {
          return res.status(409).json({
            success: false,
            message: `Cannot approve leave request. Another employee from the same department (${departmentConflicts.department}) already has approved leave during this period.`,
            conflicts: departmentConflicts.conflicts,
          });
        }
      }

      const updatedRequest = await LeaveModel.update(parseInt(id), {
        status,
        reason,
      });

      return res.json({
        success: true,
        message: "Leave request updated successfully",
        data: updatedRequest,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteLeaveRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const user_id = req.user?.id;
      const role = req.user?.role;

      if (!user_id) {
        throw new ApiError(401, "Unauthorized");
      }

      const leaveRequest = await LeaveModel.findById(parseInt(id));

      if (!leaveRequest) {
        throw new ApiError(404, "Leave request not found");
      }

      // Users can only delete their own pending requests
      if (leaveRequest.user_id !== user_id && role !== "admin") {
        throw new ApiError(403, "Forbidden");
      }

      if (leaveRequest.status !== "pending" && role !== "admin") {
        throw new ApiError(400, "Only pending requests can be deleted");
      }

      await LeaveModel.delete(parseInt(id));

      return res.json({
        success: true,
        message: "Leave request deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Leave Type Methods
  static async getLeaveTypes(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Fetching leave types...");

      // Add delay to prevent resource exhaustion (optional - remove in production)
      await new Promise((resolve) => setTimeout(resolve, 500));

      const leaveTypes = await LeaveTypeModel.findAll();

      console.log(`Successfully fetched ${leaveTypes.length} leave types`);

      return res.status(200).json({
        success: true,
        message: "Leave types retrieved successfully",
        data: leaveTypes,
      });
    } catch (error) {
      console.error("Error fetching leave types:", error);
      if (error instanceof ApiError) {
        return next(error);
      }
      return next(new ApiError(500, "Failed to retrieve leave types"));
    }
  }

  static async createLeaveType(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { name, description, default_days } = req.body;
      const leaveType = await LeaveTypeModel.create({
        name,
        description,
        default_days,
      });

      return res.status(201).json({
        success: true,
        message: "Leave type created successfully",
        data: leaveType,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateLeaveType(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { name, description, default_days } = req.body;

      const leaveType = await LeaveTypeModel.update(parseInt(id), {
        name,
        description,
        default_days,
      });

      return res.json({
        success: true,
        message: "Leave type updated successfully",
        data: leaveType,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteLeaveType(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      await LeaveTypeModel.delete(parseInt(id));

      return res.json({
        success: true,
        message: "Leave type deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Leave Balance Methods
  static async getLeaveBalance(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user_id = req.user?.id;

      if (!user_id) {
        throw new ApiError(401, "Unauthorized");
      }

      const leaveBalance = await LeaveBalanceModel.findByUserId(user_id);

      return res.json({
        success: true,
        data: leaveBalance,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserLeaveBalance(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;
      const leaveBalance = await LeaveBalanceModel.findByUserId(
        parseInt(userId)
      );

      if (!leaveBalance) {
        throw new ApiError(404, "Leave balance not found");
      }

      return res.json({
        success: true,
        data: leaveBalance,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateLeaveBalance(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;
      const { type_id, days } = req.body;

      const leaveBalance = await LeaveBalanceModel.update(
        parseInt(userId),
        type_id,
        days
      );

      return res.json({
        success: true,
        message: "Leave balance updated successfully",
        data: leaveBalance,
      });
    } catch (error) {
      next(error);
    }
  }
}
