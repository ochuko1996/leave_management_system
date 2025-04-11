import { Calendar, Clock, Filter } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

interface LeaveHistory {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  duration: string;
  department?: string;
  approvedBy?: string;
}

const MOCK_HISTORY: LeaveHistory[] = [
  {
    id: 1,
    type: "Academic Leave",
    startDate: "2024-01-15",
    endDate: "2024-01-20",
    status: "Completed",
    duration: "5 days",
    department: "Computer Science",
    approvedBy: "HOD Computing",
  },
  {
    id: 2,
    type: "Medical Leave",
    startDate: "2024-02-10",
    endDate: "2024-02-11",
    status: "Completed",
    duration: "1 day",
    department: "Computer Science",
    approvedBy: "Dean of Students",
  },
  {
    id: 3,
    type: "Conference Leave",
    startDate: "2023-12-05",
    endDate: "2023-12-06",
    status: "Completed",
    duration: "2 days",
    department: "Computer Science",
    approvedBy: "Academic Director",
  },
  {
    id: 4,
    type: "Study Leave",
    startDate: "2023-11-20",
    endDate: "2023-11-24",
    status: "Completed",
    duration: "5 days",
    department: "Computer Science",
    approvedBy: "HOD Computing",
  },
  {
    id: 5,
    type: "Research Leave",
    startDate: "2023-10-15",
    endDate: "2023-10-20",
    status: "Completed",
    duration: "5 days",
    department: "Computer Science",
    approvedBy: "Academic Director",
  },
];

const LEAVE_TYPES = [
  "All Types",
  "Academic Leave",
  "Medical Leave",
  "Conference Leave",
  "Study Leave",
  "Research Leave",
  "Personal Leave",
];

const YEARS = ["All Years", "2024", "2023", "2022"];

export function HistoryPage() {
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredHistory = useMemo(() => {
    return MOCK_HISTORY.filter((item) => {
      const matchesType =
        selectedType === "All Types" || item.type === selectedType;
      const matchesYear =
        selectedYear === "All Years" || item.startDate.startsWith(selectedYear);
      return matchesType && matchesYear;
    });
  }, [selectedType, selectedYear]);

  return (
    <div className="min-h-full bg-card rounded-lg p-6">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              Leave History
            </h2>
            <p className="text-sm text-muted-foreground">
              View your leave request history
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="sm:hidden px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-all duration-300 flex items-center gap-2"
            >
              <Filter size={18} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {isFilterOpen && (
          <div className="sm:hidden space-y-2 bg-accent p-4 rounded-lg border">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                Leave Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 bg-background border rounded-lg text-sm text-foreground transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              >
                {LEAVE_TYPES.map((type) => (
                  <option
                    key={type}
                    value={type}
                    className="bg-background text-foreground"
                  >
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-2 bg-background border rounded-lg text-sm text-foreground transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              >
                {YEARS.map((year) => (
                  <option
                    key={year}
                    value={year}
                    className="bg-background text-foreground"
                  >
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="hidden sm:flex items-center gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Leave Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 bg-background border rounded-lg text-sm text-foreground transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              {LEAVE_TYPES.map((type) => (
                <option
                  key={type}
                  value={type}
                  className="bg-background text-foreground"
                >
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 bg-background border rounded-lg text-sm text-foreground transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              {YEARS.map((year) => (
                <option
                  key={year}
                  value={year}
                  className="bg-background text-foreground"
                >
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

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
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredHistory.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-accent/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {item.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {item.startDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {item.endDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {item.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {item.status === "Completed" ? (
                          <span className="text-sm text-foreground capitalize text-green-500">
                            Completed
                          </span>
                        ) : (
                          <span className="text-sm text-foreground capitalize text-red-500">
                            In Progress
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
