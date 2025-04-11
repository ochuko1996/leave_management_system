import { LeaveRequestForm } from "@/components/leave/LeaveRequestForm";
import { useLeave } from "@/context/LeaveContext";
import { useEffect } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface LeaveRequest {
  id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

interface LeaveBalance {
  id: number;
  user_id: number;
  leave_type_id: number;
  leave_type?: string;
  days_remaining: number;
  default_days: number;
}

export function DashboardPage() {
  const {
    leaveRequests,
    leaveBalances,
    fetchLeaveRequests,
    fetchLeaveBalances,
  } = useLeave();

  useEffect(() => {
    const loadData = async () => {
      await fetchLeaveRequests();
      await fetchLeaveBalances();
    };
    loadData();
  }, [fetchLeaveRequests, fetchLeaveBalances]);

  const recentRequests = leaveRequests
    .sort(
      (a, b) =>
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime()
    )
    .slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getLeaveBalance = (type: string): number => {
    if (!leaveBalances || !Array.isArray(leaveBalances)) return 0;
    const balance = leaveBalances.find(
      (b) => b.leave_type?.toLowerCase() === type.toLowerCase()
    );
    return balance?.days_remaining || 0;
  };

  const getPendingRequestsCount = (): number => {
    if (!leaveRequests || !Array.isArray(leaveRequests)) return 0;
    return leaveRequests.filter((req) => req.status === "pending").length;
  };

  return (
    <div className="min-h-[calc(100vh-2rem)] bg-background rounded-lg p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage your leave requests and view statistics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Annual Leave
              </h3>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-semibold text-foreground">
              {getLeaveBalance("annual")} days
            </p>
          </div>
          <div className="bg-card rounded-lg border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Sick Leave
              </h3>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-semibold text-foreground">
              {getLeaveBalance("sick")} days
            </p>
          </div>
          <div className="bg-card rounded-lg border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Pending Requests
              </h3>
              <AlertCircle className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-semibold text-foreground">
              {getPendingRequestsCount()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Requests */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-foreground">
              Recent Requests
            </h2>
            <div className="space-y-3">
              {recentRequests.length > 0 ? (
                recentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-card rounded-lg border p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {request.leave_type}
                      </span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        <span className="text-sm capitalize text-muted-foreground">
                          {request.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(request.start_date), "MMM dd, yyyy")} -{" "}
                      {format(new Date(request.end_date), "MMM dd, yyyy")}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  No recent leave requests
                </div>
              )}
            </div>
          </div>

          {/* Leave Request Form */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-foreground">New Request</h2>
            <div className="bg-card rounded-lg border">
              <LeaveRequestForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
