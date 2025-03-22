import { useEffect, useState } from "react";
import { useLeave } from "@/context/LeaveContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { X, Check, AlertCircle } from "lucide-react";

interface LeaveRequestListProps extends React.HTMLAttributes<HTMLDivElement> {}

interface LeaveRequest {
  id: number;
  user_id: number;
  leave_type_id: number;
  leave_type?: string;
  full_name?: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  created_at?: string;
  updated_at?: string;
}

export function LeaveRequestList({
  className,
  ...props
}: LeaveRequestListProps) {
  const { leaveRequests, fetchLeaveRequests, updateRequest, deleteRequest } =
    useLeave();
  const { state } = useAuth();
  const { showToast } = useToast();
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null
  );

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      setIsLoading(true);
      await updateRequest(id, status);
      showToast("Success", `Leave request ${status} successfully`);
      setSelectedRequest(null); // Close dialog after action
    } catch (error) {
      showToast("Error", "Failed to update leave request status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);
      await deleteRequest(id);
      showToast("Success", "Leave request deleted successfully");
      setSelectedRequest(null); // Close dialog after action
    } catch (error) {
      showToast("Error", "Failed to delete leave request");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequests = leaveRequests
    .map((request) => ({
      ...request,
      id: request.id!,
      leave_type_id: request.leave_type_id,
      leave_type: request.leave_type || "Unknown Type",
      full_name: request.full_name || "Unknown User",
    }))
    .filter((request) => {
      if (filter === "all") return true;
      return request.status === filter;
    });
  console.log(state.user, "state.user");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    }
  };

  return (
    <div className={cn("p-6", className)} {...props}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-2xl font-semibold text-white">Leave Requests</h2>
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1.5 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white text-sm transition-all duration-300"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white/5 border border-white/20 rounded-lg p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium text-white">
                      {request.leave_type || "Leave Request"}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full border",
                        getStatusColor(request.status)
                      )}
                    >
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-white/60">
                    <span className="text-primary">By {request.full_name}</span>{" "}
                    • {format(new Date(request.start_date), "MMM d, yyyy")} -{" "}
                    {format(new Date(request.end_date), "MMM d, yyyy")}
                  </div>
                  <p className="text-white/80">{request.reason}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredRequests.length === 0 && (
            <div className="text-center py-12 text-white/60">
              No leave requests found
            </div>
          )}
        </div>
      </div>

      {/* Leave Request Details Dialog */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-accent rounded-lg border border-white/20 p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                Leave Request Details
              </h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-white/60 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/60">Requested By</label>
                <p className="text-white font-medium">
                  {selectedRequest.full_name}
                </p>
              </div>
              <div>
                <label className="text-sm text-white/60">Leave Type</label>
                <p className="text-white">{selectedRequest.leave_type}</p>
              </div>
              <div>
                <label className="text-sm text-white/60">Duration</label>
                <p className="text-white">
                  {format(new Date(selectedRequest.start_date), "MMM d, yyyy")}{" "}
                  - {format(new Date(selectedRequest.end_date), "MMM d, yyyy")}
                </p>
              </div>
              <div>
                <label className="text-sm text-white/60">Status</label>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full border",
                      getStatusColor(selectedRequest.status)
                    )}
                  >
                    {selectedRequest.status.charAt(0).toUpperCase() +
                      selectedRequest.status.slice(1)}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm text-white/60">Reason</label>
                <p className="text-white">{selectedRequest.reason}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                {(state.user?.role === "admin" || state.user?.role === "hod") &&
                  selectedRequest.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusUpdate(selectedRequest.id, "approved")
                        }
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-colors duration-300"
                      >
                        <Check size={18} />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(selectedRequest.id, "rejected")
                        }
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors duration-300"
                      >
                        <X size={18} />
                        <span>Reject</span>
                      </button>
                    </>
                  )}

                {((state.user?.id === selectedRequest.user_id &&
                  selectedRequest.status === "pending") ||
                  state.user?.role === "admin") && (
                  <button
                    onClick={() => handleDelete(selectedRequest.id)}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors duration-300"
                  >
                    <X size={18} />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
