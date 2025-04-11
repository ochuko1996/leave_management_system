import {
  Clock,
  Calendar,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLeave } from "../../context/LeaveContext";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { useRole } from "../../hooks/useRole";

interface LeaveRequest {
  id?: number;
  user_id: number;
  leave_type_id: number;
  leave_type?: string;
  full_name?: string;
  start_date: string;
  end_date: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
  created_at?: string;
  updated_at?: string;
}

export function RequestsPage() {
  const { user } = useAuth();
  const { canManageRequests } = useRole();
  const {
    leaveRequests,
    isLoading,
    error,
    fetchLeaveRequests,
    deleteRequest,
    updateRequest,
  } = useLeave();
  const navigate = useNavigate();
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null
  );

  useEffect(() => {
    fetchLeaveRequests();
  }, [fetchLeaveRequests]);

  if (!canManageRequests) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleNewRequest = () => {
    navigate("/"); // Navigate to dashboard where the request form is
  };

  const handleViewDetails = (request: LeaveRequest) => {
    setSelectedRequest(request);
  };

  const closeDetails = () => {
    setSelectedRequest(null);
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const getStatusIcon = (status: LeaveRequest["status"]) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={20} className="text-green-400" />;
      case "rejected":
        return <XCircle size={20} className="text-red-400" />;
      default:
        return <AlertCircle size={20} className="text-yellow-400" />;
    }
  };

  const handleDelete = async (request: LeaveRequest) => {
    if (!request.id) return;
    try {
      await deleteRequest(request.id);
      setSelectedRequest(null);
    } catch (error) {
      console.error("Failed to delete request:", error);
    }
  };

  const handleUpdateStatus = async (
    request: LeaveRequest,
    newStatus: string
  ) => {
    if (!request.id) return;
    try {
      await updateRequest(request.id, newStatus);
      setSelectedRequest(null);
    } catch (error) {
      console.error("Failed to update request status:", error);
    }
  };

  if (error) {
    return (
      <div className="min-h-full bg-card rounded-lg p-6 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p>Failed to load leave requests. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-card rounded-lg p-4 sm:p-6">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              Leave Requests
            </h2>
            <p className="text-sm text-muted-foreground">
              View and manage your leave requests
            </p>
          </div>
          <button
            onClick={handleNewRequest}
            className="w-full sm:w-auto px-4 py-2 bg-primary text-primary-foreground rounded-lg transition-all duration-300 hover:bg-primary/90 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>New Request</span>
          </button>
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block">
          <div className="bg-card rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {leaveRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="hover:bg-accent/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {request.leave_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {new Date(request.start_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {new Date(request.end_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {calculateDuration(
                          request.start_date,
                          request.end_date
                        )}{" "}
                        days
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          <span className="text-sm text-foreground capitalize">
                            {request.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="text-sm text-primary hover:text-primary/80"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden space-y-4">
          {leaveRequests.map((request) => (
            <div
              key={request.id}
              className="bg-card rounded-lg border p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {request.leave_type}
                </span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(request.status)}
                  <span className="text-sm text-foreground capitalize">
                    {request.status}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="text-foreground">
                    {new Date(request.start_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">End Date</span>
                  <span className="text-foreground">
                    {new Date(request.end_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="text-foreground">
                    {calculateDuration(request.start_date, request.end_date)}{" "}
                    days
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleViewDetails(request)}
                className="w-full px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-all duration-300"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                Leave Request Details
              </h3>
              <button
                onClick={closeDetails}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Type</label>
                <p className="text-foreground">{selectedRequest.leave_type}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">
                  Duration
                </label>
                <p className="text-foreground">
                  {format(new Date(selectedRequest.start_date), "MMM dd, yyyy")}{" "}
                  - {format(new Date(selectedRequest.end_date), "MMM dd, yyyy")}
                  <span className="text-muted-foreground text-sm ml-2">
                    (
                    {calculateDuration(
                      selectedRequest.start_date,
                      selectedRequest.end_date
                    )}{" "}
                    days)
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Status</label>
                <div className="flex items-center gap-2 text-foreground">
                  {getStatusIcon(selectedRequest.status)}
                  <span className="capitalize">{selectedRequest.status}</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Reason</label>
                <p className="text-foreground">{selectedRequest.reason}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
