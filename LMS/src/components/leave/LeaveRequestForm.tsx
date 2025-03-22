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
    leaveType: "",
    reason: "",
  });
  const { leaveTypes, fetchLeaveTypes, submitRequest } = useLeave();

  // fetchLeaveTypes();
  useEffect(() => {
    const fetchLeaves = async () => await fetchLeaveTypes();
    fetchLeaves();
  }, []);

  // Mock data for available leave balances
  const leaveBalances = {
    annual: 15,
    sick: 10,
    personal: 5,
    unpaid: "Unlimited",
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (!formData.leaveType) {
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
    }

    // Calculate leave duration
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      // Check if requested days exceed available balance
      if (
        formData.leaveType !== "unpaid" &&
        diffDays > leaveBalances[formData.leaveType]
      ) {
        newErrors.endDate = `Requested days exceed available ${formData.leaveType} leave balance`;
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
        typeId: parseInt(formData.leaveType),
      };
      await submitRequest(newRequest);
      showToast("Success", "Leave request submitted successfully");
      navigate("/requests");
    } catch (error) {
      showToast("Error", "Failed to submit leave request");
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
            <h2 className="text-xl sm:text-2xl font-semibold text-white">
              Request Leave
            </h2>
            <p className="text-sm text-white/60">Submit a new leave request</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <div className="bg-white/10 p-4 sm:p-6 rounded-lg backdrop-blur-sm border border-white/20">
            <div className="text-sm font-medium text-white/60">
              Annual Leave
            </div>
            <div className="text-xl sm:text-2xl font-semibold mt-1 text-white">
              {leaveBalances.annual} days
            </div>
          </div>
          <div className="bg-white/10 p-4 sm:p-6 rounded-lg backdrop-blur-sm border border-white/20">
            <div className="text-sm font-medium text-white/60">Sick Leave</div>
            <div className="text-xl sm:text-2xl font-semibold mt-1 text-white">
              {leaveBalances.sick} days
            </div>
          </div>
          <div className="bg-white/10 p-4 sm:p-6 rounded-lg backdrop-blur-sm border border-white/20">
            <div className="text-sm font-medium text-white/60">
              Personal Leave
            </div>
            <div className="text-xl sm:text-2xl font-semibold mt-1 text-white">
              {leaveBalances.personal} days
            </div>
          </div>
          <div className="bg-white/10 p-4 sm:p-6 rounded-lg backdrop-blur-sm border border-white/20">
            <div className="text-sm font-medium text-white/60">
              Unpaid Leave
            </div>
            <div className="text-xl sm:text-2xl font-semibold mt-1 text-white">
              {leaveBalances.unpaid}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <form onSubmit={handleSubmit} className="divide-y divide-white/10">
            <div className="p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className={cn(
                        "w-full p-2 pr-8 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white transition-all duration-300",
                        errors.startDate &&
                          "border-red-400 focus:ring-red-400/30"
                      )}
                      required
                    />
                    <Calendar className="absolute right-2 top-2.5 h-5 w-5 text-white/60" />
                  </div>
                  {errors.startDate && (
                    <div className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <AlertCircle size={12} />
                      {errors.startDate}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className={cn(
                        "w-full p-2 pr-8 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white transition-all duration-300",
                        errors.endDate && "border-red-400 focus:ring-red-400/30"
                      )}
                      required
                    />
                    <Calendar className="absolute right-2 top-2.5 h-5 w-5 text-white/60" />
                  </div>
                  {errors.endDate && (
                    <div className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <AlertCircle size={12} />
                      {errors.endDate}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Leave Type
                </label>
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  className={cn(
                    "w-full p-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white transition-all duration-300",
                    errors.leaveType && "border-red-400 focus:ring-red-400/30"
                  )}
                  required
                >
                  <option value="" className="bg-accent text-white">
                    Select a leave type
                  </option>
                  {leaveTypes.map((types) => (
                    <option
                      key={types.id}
                      value={types.id}
                      className="bg-accent text-white"
                    >
                      {types.name}
                    </option>
                  ))}
                  {/* <option value="sick" className="bg-accent text-white">
                    Sick Leave
                  </option>
                  <option value="personal" className="bg-accent text-white">
                    Personal Leave
                  </option>
                  <option value="unpaid" className="bg-accent text-white">
                    Unpaid Leave
                  </option> */}
                </select>
                {formData.startDate &&
                  formData.endDate &&
                  formData.leaveType !== "unpaid" && (
                    <div className="text-xs text-white/60 flex items-center gap-1 mt-1">
                      <Clock size={12} />
                      Duration: {calculateDuration()} days (Available:{" "}
                      {leaveBalances[formData.leaveType]} days)
                    </div>
                  )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Reason</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className={cn(
                    "w-full p-2 bg-white/5 border border-white/20 rounded-lg min-h-[100px] focus:outline-none focus:ring-2 focus:ring-white/30 text-white transition-all duration-300",
                    errors.reason && "border-red-400 focus:ring-red-400/30"
                  )}
                  placeholder="Please provide a detailed reason for your leave request..."
                  required
                />
                {errors.reason && (
                  <div className="text-xs text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle size={12} />
                    {errors.reason}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-white/5">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "px-6 py-2 bg-primary text-white rounded-lg transition-all duration-300 hover:bg-primary/90 hover:scale-105 active:scale-95",
                    isSubmitting && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
