import { useEffect } from "react";
import { LeaveRequestForm } from "@/components/leave/LeaveRequestForm";
import { LeaveRequestList } from "@/components/leave/LeaveRequestList";
import { useLeave } from "@/context/LeaveContext";

export function LeavePage() {
  const { fetchLeaveTypes, fetchLeaveBalances } = useLeave();

  useEffect(() => {
    fetchLeaveTypes();
    fetchLeaveBalances();
  }, [fetchLeaveTypes, fetchLeaveBalances]);

  return (
    <div className="min-h-full bg-background">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-foreground">
                Leave Management
              </h2>
              <p className="text-sm text-muted-foreground">
                Submit and manage your leave requests
              </p>
            </div>
          </div>

          <div className="grid gap-8">
            {/* <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-medium text-foreground mb-4">
                New Leave Request
              </h3>
              <LeaveRequestForm />
            </div> */}

            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-medium text-foreground mb-4">
                Your Leave Requests
              </h3>
              <LeaveRequestList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
