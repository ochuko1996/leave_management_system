import { Calendar, Clock, Filter } from 'lucide-react'
import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'

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
    type: 'Academic Leave',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    status: 'Completed',
    duration: '5 days',
    department: 'Computer Science',
    approvedBy: 'HOD Computing'
  },
  {
    id: 2,
    type: 'Medical Leave',
    startDate: '2024-02-10',
    endDate: '2024-02-11',
    status: 'Completed',
    duration: '1 day',
    department: 'Computer Science',
    approvedBy: 'Dean of Students'
  },
  {
    id: 3,
    type: 'Conference Leave',
    startDate: '2023-12-05',
    endDate: '2023-12-06',
    status: 'Completed',
    duration: '2 days',
    department: 'Computer Science',
    approvedBy: 'Academic Director'
  },
  {
    id: 4,
    type: 'Study Leave',
    startDate: '2023-11-20',
    endDate: '2023-11-24',
    status: 'Completed',
    duration: '5 days',
    department: 'Computer Science',
    approvedBy: 'HOD Computing'
  },
  {
    id: 5,
    type: 'Research Leave',
    startDate: '2023-10-15',
    endDate: '2023-10-20',
    status: 'Completed',
    duration: '5 days',
    department: 'Computer Science',
    approvedBy: 'Academic Director'
  }
]

const LEAVE_TYPES = [
  'All Types',
  'Academic Leave',
  'Medical Leave',
  'Conference Leave',
  'Study Leave',
  'Research Leave',
  'Personal Leave'
]

const YEARS = ['All Years', '2024', '2023', '2022']

export function HistoryPage() {
  const [selectedType, setSelectedType] = useState('All Types')
  const [selectedYear, setSelectedYear] = useState('All Years')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const filteredHistory = useMemo(() => {
    return MOCK_HISTORY.filter(item => {
      const matchesType = selectedType === 'All Types' || item.type === selectedType
      const matchesYear = selectedYear === 'All Years' || item.startDate.startsWith(selectedYear)
      return matchesType && matchesYear
    })
  }, [selectedType, selectedYear])

  return (
    <div className="min-h-full bg-gradient-to-br from-accent to-accent/90 rounded-lg p-6">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-white">Leave History</h2>
            <p className="text-sm text-white/60">View your academic leave history and records</p>
          </div>
          
          {/* Filter Button (Mobile) */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="sm:hidden w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white flex items-center justify-center gap-2 hover:bg-white/20 transition-all duration-300"
          >
            <Filter size={16} />
            <span>Filter</span>
          </button>

          {/* Filters (Desktop) */}
          <div className="hidden sm:flex items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer"
            >
              {LEAVE_TYPES.map(type => (
                <option key={type} value={type} className="bg-accent text-white">{type}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer"
            >
              {YEARS.map(year => (
                <option key={year} value={year} className="bg-accent text-white">{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile Filters */}
        {isFilterOpen && (
          <div className="sm:hidden space-y-2 bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/20">
            <div className="space-y-2">
              <label className="text-sm text-white/60">Leave Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer"
              >
                {LEAVE_TYPES.map(type => (
                  <option key={type} value={type} className="bg-accent text-white">{type}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/60">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer"
              >
                {YEARS.map(year => (
                  <option key={year} value={year} className="bg-accent text-white">{year}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <div className="grid grid-cols-6 gap-4 p-4 border-b border-white/20 text-sm font-medium text-white/60">
            <div>Type</div>
            <div>Start Date</div>
            <div>End Date</div>
            <div>Duration</div>
            <div>Approved By</div>
            <div>Status</div>
          </div>
          {filteredHistory.length > 0 ? (
            <div className="divide-y divide-white/10">
              {filteredHistory.map((item) => (
                <div 
                  key={item.id} 
                  className="grid grid-cols-6 gap-4 p-4 items-center text-white transition-all duration-300 hover:bg-white/5 cursor-pointer group"
                >
                  <div className="transition-all duration-300 group-hover:translate-x-1">{item.type}</div>
                  <div className="flex items-center gap-2 transition-all duration-300 group-hover:translate-x-1">
                    <Calendar size={16} className="text-white/60 transition-transform duration-300 group-hover:scale-110" />
                    {item.startDate}
                  </div>
                  <div className="flex items-center gap-2 transition-all duration-300 group-hover:translate-x-1">
                    <Calendar size={16} className="text-white/60 transition-transform duration-300 group-hover:scale-110" />
                    {item.endDate}
                  </div>
                  <div className="flex items-center gap-2 transition-all duration-300 group-hover:translate-x-1">
                    <Clock size={16} className="text-white/60 transition-transform duration-300 group-hover:scale-110" />
                    {item.duration}
                  </div>
                  <div className="transition-all duration-300 group-hover:translate-x-1 text-white/80">
                    {item.approvedBy}
                  </div>
                  <div>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-300 transition-all duration-300 group-hover:bg-green-500/30">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-white/60">
              <p>No leave history found for the selected filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 