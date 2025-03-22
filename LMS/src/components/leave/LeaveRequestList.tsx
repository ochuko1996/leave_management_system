import { useEffect, useState } from "react";
import { useLeave } from "@/context/LeaveContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface LeaveRequestListProps extends React.HTMLAttributes<HTMLDivElement> {}

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

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      setIsLoading(true);
      await updateRequest(id, status);
      showToast("Success", `Leave request ${status} successfully`);
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
    } catch (error) {
      showToast("Error", "Failed to delete leave request");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequests = leaveRequests.filter((request) => {
    if (filter === "all") return true;
    return request.status === filter;
  });

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
                    {format(new Date(request.start_date), "MMM d, yyyy")} -{" "}
                    {format(new Date(request.end_date), "MMM d, yyyy")}
                  </div>
                  <p className="text-white/80">{request.reason}</p>
                </div>

                {(state.user?.role === "admin" || state.user?.role === "hod") &&
                  request.status === "pending" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleStatusUpdate(request.id!, "approved")
                        }
                        disabled={isLoading}
                        className="px-4 py-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-colors duration-300"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(request.id!, "rejected")
                        }
                        disabled={isLoading}
                        className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors duration-300"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                {((state.user?.id === request.user_id &&
                  request.status === "pending") ||
                  state.user?.role === "admin") && (
                  <button
                    onClick={() => handleDelete(request.id!)}
                    disabled={isLoading}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors duration-300"
                  >
                    Delete
                  </button>
                )}
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
    </div>
  );
}
