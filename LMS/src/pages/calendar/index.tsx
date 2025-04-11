import { Info } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLeave } from "@/context/LeaveContext";
import { format } from "date-fns";

export function CalendarPage() {
  const { leaveRequests, fetchLeaveRequests, isLoading } = useLeave();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const goToPreviousMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const getDateString = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return format(date, "yyyy-MM-dd");
  };

  const getLeavesForDate = (day: number) => {
    const dateString = getDateString(day);
    return leaveRequests.filter((leave) => {
      const start = new Date(leave.start_date);
      const end = new Date(leave.end_date);
      const current = new Date(dateString);
      return current >= start && current <= end;
    });
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    );
  };

  return (
    <div className="min-h-full bg-card rounded-lg p-4 lg:p-6">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl lg:text-2xl font-semibold text-foreground">
              Leave Calendar
            </h2>
            <p className="text-sm text-muted-foreground">
              View and manage team leave schedules
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousMonth}
              className="px-3 lg:px-4 py-2 text-sm border border-border text-foreground rounded-lg transition-all duration-300 hover:bg-accent hover:scale-105 active:scale-95"
            >
              Previous
            </button>
            <span className="text-sm font-medium text-foreground min-w-[100px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button
              onClick={goToNextMonth}
              className="px-3 lg:px-4 py-2 text-sm border border-border text-foreground rounded-lg transition-all duration-300 hover:bg-accent hover:scale-105 active:scale-95"
            >
              Next
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="lg:col-span-2">
            <div className="bg-background rounded-lg border overflow-hidden">
              <div className="grid grid-cols-7 gap-px border-b border-border">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="p-2 lg:p-4 text-xs lg:text-sm font-medium text-foreground text-center"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>
              <div className="grid grid-cols-7 gap-px">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2 lg:p-4 bg-accent/5" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const leaves = getLeavesForDate(day);
                  const hasLeaves = leaves.length > 0;

                  return (
                    <div
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={cn(
                        "p-2 lg:p-4 cursor-pointer transition-all duration-300 hover:bg-accent/50 group relative",
                        isToday(day) && "bg-primary/10",
                        hasLeaves && "bg-accent/10",
                        selectedDate?.getDate() === day && "ring-2 ring-ring"
                      )}
                    >
                      <div
                        className={cn(
                          "text-xs lg:text-sm text-foreground transition-all duration-300 group-hover:font-medium text-center",
                          isToday(day) && "font-bold"
                        )}
                      >
                        {day}
                      </div>
                      {hasLeaves && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                          {leaves.map((leave, index) => (
                            <div
                              key={index}
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                leave.status === "approved" && "bg-green-400",
                                leave.status === "pending" && "bg-yellow-400",
                                leave.status === "rejected" && "bg-red-400"
                              )}
                              title={`${leave.full_name || "Unknown"} - ${
                                leave.leave_type || "Leave"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg border border-border p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">
                Leave Details
              </h3>
              {isLoading ? (
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  Loading leave data...
                </div>
              ) : selectedDate ? (
                <>
                  <div className="text-sm text-muted-foreground">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  {getLeavesForDate(selectedDate.getDate()).length > 0 ? (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {getLeavesForDate(selectedDate.getDate()).map(
                        (leave, index) => (
                          <div
                            key={index}
                            className="bg-accent/10 rounded-lg p-3 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-foreground">
                                {leave.full_name || "Unknown"}
                              </span>
                              <span
                                className={cn(
                                  "text-xs px-2 py-1 rounded-full",
                                  leave.status === "approved" &&
                                    "bg-green-500/20 text-green-500",
                                  leave.status === "pending" &&
                                    "bg-yellow-500/20 text-yellow-500",
                                  leave.status === "rejected" &&
                                    "bg-red-500/20 text-red-500"
                                )}
                              >
                                {leave.status}
                              </span>
                            </div>
                            <div className="text-sm text-foreground">
                              {leave.leave_type || "Leave"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(
                                new Date(leave.start_date),
                                "MMM dd, yyyy"
                              )}{" "}
                              -{" "}
                              {format(new Date(leave.end_date), "MMM dd, yyyy")}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Reason: {leave.reason}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Info size={16} />
                      No leave requests for this date
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Info size={16} />
                  Select a date to view leave details
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
