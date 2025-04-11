import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLeave } from "@/context/LeaveContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";
import { Calendar, Clock, AlertCircle } from "lucide-react";

interface LeaveRequestFormProps extends React.HTMLAttributes<HTMLDivElement> {}

interface LeaveRequest {
  startDate: string;
  endDate: string;
  typeId: number;
  reason: string;
}

interface ValidationErrors {
  startDate?: string;
  endDate?: string;
  leaveType?: string;
  reason?: string;
}

interface LeaveBalances {
  [key: string]: number | string;
  annual: number;
  sick: number;
  personal: number;
  unpaid: string;
}

export function LeaveRequestForm({
  className,
  ...props
}: LeaveRequestFormProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    typeId: "",
    reason: "",
  });
  const { leaveTypes, fetchLeaveTypes, submitRequest, leaveBalances } =
    useLeave();

  // fetchLeaveTypes();
  useEffect(() => {
    const fetchLeaves = async () => await fetchLeaveTypes();
    fetchLeaves();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (!formData.typeId) {
      newErrors.leaveType = "Leave type is required";
    }

    if (!formData.reason) {
      newErrors.reason = "Reason is required";
    }

    // Check if end date is after start date
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = "End date must be after start date";
      }

      // Calculate leave duration and check balance
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      // Only check balance for leave types with numeric balances
      const selectedType = formData.typeId;
      const balance = leaveBalances[selectedType];
      if (
        selectedType !== "unpaid" &&
        typeof balance === "number" &&
        diffDays > balance
      ) {
        newErrors.endDate = `Requested days exceed available ${selectedType} leave balance`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Error", "Please fix the errors in the form");
      return;
    }

    try {
      setIsSubmitting(true);
      const newRequest: LeaveRequest = {
        endDate: formData.endDate,
        startDate: formData.startDate,
        reason: formData.reason,
        typeId: parseInt(formData.typeId),
      };
      console.log(newRequest, "newRequest");

      await submitRequest(newRequest);
      showToast("Success", "Leave request submitted successfully");
      navigate("/requests");
    } catch (error: any) {
      // Check if it's a department conflict error
      if (error.message && error.message.includes("department")) {
        showToast("Error", error.message);
      } else {
        showToast("Error", "Failed to submit leave request");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return null;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return diffDays;
  };

  return (
    <div className={cn("min-h-full", className)} {...props}>
      <div className="h-full p-4 sm:p-6 max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              Request Leave
            </h2>
            <p className="text-sm text-muted-foreground">
              Submit a new leave request
            </p>
          </div>
        </div>

        {/* Department Policy Notice */}
        <div className="mb-6 p-4 border rounded-lg bg-yellow-50 flex items-start gap-3">
          <div className="text-amber-600 mt-0.5">
            <AlertCircle size={18} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-amber-800">
              Department Policy
            </h3>
            <p className="text-sm text-amber-700 mt-1">
              Please note that two employees from the same department cannot
              have approved leave at the same time or in the same month. Your
              request may be rejected if it conflicts with an already approved
              leave.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <div className="bg-card p-4 sm:p-6 rounded-lg border">
            <div className="text-sm font-medium text-muted-foreground">
              Annual Leave
            </div>
            <div className="text-xl sm:text-2xl font-semibold mt-1 text-foreground">
              {leaveBalances.annual} days
            </div>
          </div>
          <div className="bg-card p-4 sm:p-6 rounded-lg border">
            <div className="text-sm font-medium text-muted-foreground">
              Sick Leave
            </div>
            <div className="text-xl sm:text-2xl font-semibold mt-1 text-foreground">
              {leaveBalances.sick} days
            </div>
          </div>
          <div className="bg-card p-4 sm:p-6 rounded-lg border">
            <div className="text-sm font-medium text-muted-foreground">
              Personal Leave
            </div>
            <div className="text-xl sm:text-2xl font-semibold mt-1 text-foreground">
              {leaveBalances.personal} days
            </div>
          </div>
          <div className="bg-card p-4 sm:p-6 rounded-lg border">
            <div className="text-sm font-medium text-muted-foreground">
              Unpaid Leave
            </div>
            <div className="text-xl sm:text-2xl font-semibold mt-1 text-foreground">
              {leaveBalances.unpaid}
            </div>
          </div>
        </div> */}

        {/* Form */}
        <div className="bg-card rounded-lg border">
          <form onSubmit={handleSubmit} className="divide-y divide-border">
            <div className="p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className={cn(
                        "w-full p-2 pr-8 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300",
                        errors.startDate &&
                          "border-destructive focus:ring-destructive/30"
                      )}
                      required
                    />
                    <Calendar className="absolute right-2 top-2.5 h-5 w-5 text-foreground" />
                  </div>
                  {errors.startDate && (
                    <div className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle size={12} />
                      {errors.startDate}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className={cn(
                        "w-full p-2 pr-8 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300",
                        errors.endDate &&
                          "border-destructive focus:ring-destructive/30"
                      )}
                      required
                    />
                    <Calendar className="absolute right-2 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                  {errors.endDate && (
                    <div className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle size={12} />
                      {errors.endDate}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Leave Type
                </label>
                <select
                  name="typeId"
                  value={formData.typeId}
                  onChange={handleChange}
                  className={cn(
                    "w-full p-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300",
                    errors.leaveType &&
                      "border-destructive focus:ring-destructive/30"
                  )}
                  required
                >
                  <option value="">Select a leave type</option>
                  {leaveTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name} (
                      {leaveBalances.find((b) => b.leave_type_id === type.id)
                        ?.days_remaining || 0}{" "}
                      days remaining)
                    </option>
                  ))}
                </select>
                {errors.leaveType && (
                  <div className="text-xs text-destructive flex items-center gap-1 mt-1">
                    <AlertCircle size={12} />
                    {errors.leaveType}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Reason
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={4}
                  className={cn(
                    "w-full p-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300",
                    errors.reason &&
                      "border-destructive focus:ring-destructive/30"
                  )}
                  placeholder="Please provide a reason for your leave request"
                  required
                />
                {errors.reason && (
                  <div className="text-xs text-destructive flex items-center gap-1 mt-1">
                    <AlertCircle size={12} />
                    {errors.reason}
                  </div>
                )}
              </div>

              {calculateDuration() && (
                <div className="text-sm text-muted-foreground">
                  Duration: {calculateDuration()} days
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 bg-accent/5">
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full sm:w-auto px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-all duration-300",
                  "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
