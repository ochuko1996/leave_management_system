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
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLeave } from "@/context/LeaveContext";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";

interface LeaveRequest {
  id: number;
  type_id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
  user_id: number;
}

export function RequestsPage() {
  const { leaveRequests, isLoading, error, fetchLeaveRequests } = useLeave();
  const { state } = useAuth();
  const navigate = useNavigate();
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null
  );

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

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

  if (error) {
    return (
      <div className="min-h-full bg-gradient-to-br from-accent to-accent/90 rounded-lg p-6 flex items-center justify-center">
        <div className="text-center text-white/60">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p>Failed to load leave requests. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-accent to-accent/90 rounded-lg p-4 sm:p-6">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">
              Leave Requests
            </h2>
            <p className="text-sm text-white/60">
              View and manage your leave requests
            </p>
          </div>
          <button
            onClick={handleNewRequest}
            className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg transition-all duration-300 hover:bg-primary/90 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>New Request</span>
          </button>
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <div className="grid grid-cols-6 gap-4 p-4 border-b border-white/20 text-sm font-medium text-white/60">
            <div>Type</div>
            <div>Start Date</div>
            <div>End Date</div>
            <div>Duration</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-white/60">
              <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" />
              <p>Loading leave requests...</p>
            </div>
          ) : leaveRequests.length === 0 ? (
            <div className="p-8 text-center text-white/60">
              <Calendar className="w-8 h-8 mx-auto mb-4" />
              <p>No leave requests found</p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {leaveRequests.map((request) => (
                <div
                  key={request.id}
                  className="grid grid-cols-6 gap-4 p-4 text-sm text-white hover:bg-white/5 transition-colors duration-200"
                >
                  <div>{request.leave_type}</div>
                  <div>
                    {format(new Date(request.start_date), "MMM dd, yyyy")}
                  </div>
                  <div>
                    {format(new Date(request.end_date), "MMM dd, yyyy")}
                  </div>
                  <div>
                    {calculateDuration(request.start_date, request.end_date)}{" "}
                    days
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(request.status)}
                    <span className="capitalize">{request.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetails(request as LeaveRequest)}
                      className="px-3 py-1 text-xs bg-white/10 rounded-md hover:bg-white/20 transition-colors duration-200"
                    >
                      View Details
                    </button>
                    {state.user?.id === request.user_id &&
                      request.status === "pending" && (
                        <button className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30 transition-colors duration-200">
                          Cancel
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile View */}
        <div className="sm:hidden space-y-4">
          {isLoading ? (
            <div className="text-center text-white/60 py-8">
              <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" />
              <p>Loading leave requests...</p>
            </div>
          ) : leaveRequests.length === 0 ? (
            <div className="text-center text-white/60 py-8">
              <Calendar className="w-8 h-8 mx-auto mb-4" />
              <p>No leave requests found</p>
            </div>
          ) : (
            leaveRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">
                    {request.leave_type}
                  </span>
                  <div className="flex items-center gap-2 text-sm">
                    {getStatusIcon(request.status)}
                    <span className="capitalize text-white/60">
                      {request.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-white/60 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>
                      {format(new Date(request.start_date), "MMM dd, yyyy")} -{" "}
                      {format(new Date(request.end_date), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>
                      {calculateDuration(request.start_date, request.end_date)}{" "}
                      days
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewDetails(request as LeaveRequest)}
                    className="flex-1 px-3 py-2 bg-white/10 rounded-md hover:bg-white/20 transition-colors duration-200 text-white text-sm"
                  >
                    View Details
                  </button>
                  {state.user?.id === request.user_id &&
                    request.status === "pending" && (
                      <button className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30 transition-colors duration-200 text-sm">
                        Cancel
                      </button>
                    )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-accent rounded-lg border border-white/20 p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                Leave Request Details
              </h3>
              <button
                onClick={closeDetails}
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/60">Type</label>
                <p className="text-white">{selectedRequest.leave_type}</p>
              </div>
              <div>
                <label className="text-sm text-white/60">Duration</label>
                <p className="text-white">
                  {format(new Date(selectedRequest.start_date), "MMM dd, yyyy")}{" "}
                  - {format(new Date(selectedRequest.end_date), "MMM dd, yyyy")}
                  <span className="text-white/60 text-sm ml-2">
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
                <label className="text-sm text-white/60">Status</label>
                <div className="flex items-center gap-2 text-white">
                  {getStatusIcon(selectedRequest.status)}
                  <span className="capitalize">{selectedRequest.status}</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-white/60">Reason</label>
                <p className="text-white">{selectedRequest.reason}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
