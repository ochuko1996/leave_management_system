import {  Info } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

// Mock leave data - in a real app, this would come from an API or database
const MOCK_LEAVES = [
  {
    id: 1,
    startDate: '2024-03-15',
    endDate: '2024-03-20',
    type: 'Annual Leave',
    status: 'Approved',
    employee: 'John Doe'
  },
  {
    id: 2,
    startDate: '2024-03-10',
    endDate: '2024-03-11',
    type: 'Sick Leave',
    status: 'Approved',
    employee: 'Jane Smith'
  },
  {
    id: 3,
    startDate: '2024-03-25',
    endDate: '2024-03-25',
    type: 'Personal Leave',
    status: 'Pending',
    employee: 'John Doe'
  }
]

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const goToPreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() - 1)
      return newDate
    })
  }

  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + 1)
      return newDate
    })
  }

  const isToday = (day: number) => {
    const today = new Date()
    return day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
  }

  const getDateString = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return date.toISOString().split('T')[0]
  }

  const getLeavesForDate = (day: number) => {
    const dateString = getDateString(day)
    return MOCK_LEAVES.filter(leave => {
      const start = new Date(leave.startDate)
      const end = new Date(leave.endDate)
      const current = new Date(dateString)
      return current >= start && current <= end
    })
  }

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-accent to-accent/90 rounded-lg p-6">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-white">Leave Calendar</h2>
            <p className="text-sm text-white/60">View and manage team leave schedules</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={goToPreviousMonth}
              className="px-4 py-2 text-sm border border-white/20 text-white rounded-lg transition-all duration-300 hover:bg-white/10 hover:scale-105 active:scale-95"
            >
              Previous
            </button>
            <span className="text-sm font-medium text-white min-w-[100px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button 
              onClick={goToNextMonth}
              className="px-4 py-2 text-sm border border-white/20 text-white rounded-lg transition-all duration-300 hover:bg-white/10 hover:scale-105 active:scale-95"
            >
              Next
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="grid grid-cols-7 gap-px border-b border-white/20">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-4 text-sm font-medium text-white text-center">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-px">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-4 bg-white/5" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const leaves = getLeavesForDate(day)
                  const hasLeaves = leaves.length > 0
                  
                  return (
                    <div
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={cn(
                        "p-4 cursor-pointer transition-all duration-300 hover:bg-white/10 group relative",
                        isToday(day) && "bg-primary/20",
                        hasLeaves && "bg-white/5",
                        selectedDate?.getDate() === day && "ring-2 ring-white/40"
                      )}
                    >
                      <div className={cn(
                        "text-sm text-white transition-all duration-300 group-hover:font-medium text-center",
                        isToday(day) && "font-bold"
                      )}>
                        {day}
                      </div>
                      {hasLeaves && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                          {leaves.map((leave, index) => (
                            <div 
                              key={index}
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                leave.status === 'Approved' && "bg-green-400",
                                leave.status === 'Pending' && "bg-yellow-400"
                              )}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Leave Details</h3>
              {selectedDate ? (
                <>
                  <div className="text-sm text-white/60">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  {getLeavesForDate(selectedDate.getDate()).length > 0 ? (
                    <div className="space-y-3">
                      {getLeavesForDate(selectedDate.getDate()).map((leave, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white">{leave.employee}</span>
                            <span className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              leave.status === 'Approved' && "bg-green-500/20 text-green-300",
                              leave.status === 'Pending' && "bg-yellow-500/20 text-yellow-300"
                            )}>
                              {leave.status}
                            </span>
                          </div>
                          <div className="text-sm text-white/60">{leave.type}</div>
                          <div className="text-xs text-white/40">
                            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-white/60 flex items-center gap-2">
                      <Info size={16} />
                      No leave requests for this date
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-white/60 flex items-center gap-2">
                  <Info size={16} />
                  Select a date to view leave details
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 