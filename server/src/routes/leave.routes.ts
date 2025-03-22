import { Router } from "express";
import { LeaveController } from "../controllers/leave.controller";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

// Leave Request Routes
router.post("/request", authenticate, LeaveController.createLeaveRequest);
router.get("/requests", authenticate, LeaveController.getLeaveRequests);
router.get("/requests/:id", authenticate, LeaveController.getLeaveRequestById);
router.put("/requests/:id", authenticate, LeaveController.updateLeaveRequest);
router.delete(
  "/requests/:id",
  authenticate,
  LeaveController.deleteLeaveRequest
);

// Leave Types Routes
router.get("/types", authenticate, LeaveController.getLeaveTypes);
router.post(
  "/types",
  authenticate,
  authorize("admin"),
  LeaveController.createLeaveType
);
router.put(
  "/types/:id",
  authenticate,
  authorize("admin"),
  LeaveController.updateLeaveType
);
router.delete(
  "/types/:id",
  authenticate,
  authorize("admin"),
  LeaveController.deleteLeaveType
);

// Leave Balance Routes
router.get("/balance", authenticate, LeaveController.getLeaveBalance);
router.get(
  "/balance/:userId",
  authenticate,
  authorize("admin", "hod"),
  LeaveController.getUserLeaveBalance
);
router.put(
  "/balance/:userId",
  authenticate,
  authorize("admin"),
  LeaveController.updateLeaveBalance
);

export default router;
