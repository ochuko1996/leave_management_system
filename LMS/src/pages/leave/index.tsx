import { useEffect } from "react";
import { LeaveRequestForm } from "@/components/leave/LeaveRequestForm";
import { LeaveRequestList } from "@/components/leave/LeaveRequestList";
import { useLeave } from "@/context/LeaveContext";

export function LeavePage() {
  const { fetchLeaveTypes, fetchLeaveBalances } = useLeave();

  useEffect(() => {
    fetchLeaveTypes();
    fetchLeaveBalances();
  }, []);

  return (
    <div className="min-h-screen bg-accent">
      <div className="container mx-auto py-8">
        <div className="space-y-8">
          <LeaveRequestList />
        </div>
      </div>
    </div>
  );
}
