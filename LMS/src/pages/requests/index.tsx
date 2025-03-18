import { Clock, Calendar, X, CheckCircle, XCircle, AlertCircle, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

interface LeaveRequest {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
}

const MOCK_REQUESTS: LeaveRequest[] = [
  {
    id: 1,
    type: 'Annual Leave',
    startDate: '2024-03-15',
    endDate: '2024-03-20',
    status: 'Pending',
    reason: 'Family vacation'
  },
  {
    id: 2,
    type: 'Sick Leave',
    startDate: '2024-03-10',
    endDate: '2024-03-11',
    status: 'Approved',
    reason: 'Doctor appointment'
  },
  {
    id: 3,
    type: 'Personal Leave',
    startDate: '2024-03-25',
    endDate: '2024-03-25',
    status: 'Rejected',
    reason: 'Personal matters'
  }
]

export function RequestsPage() {
  const navigate = useNavigate()
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)

  const handleNewRequest = () => {
    navigate('/')  // Navigate to dashboard where the request form is
  }

  const handleViewDetails = (request: LeaveRequest) => {
    setSelectedRequest(request)
  }

  const closeDetails = () => {
    setSelectedRequest(null)
  }

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const getStatusIcon = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle size={20} className="text-green-400" />
      case 'Rejected':
        return <XCircle size={20} className="text-red-400" />
      default:
        return <AlertCircle size={20} className="text-yellow-400" />
    }
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-accent to-accent/90 rounded-lg p-4 sm:p-6">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">Leave Requests</h2>
            <p className="text-sm text-white/60">View and manage your leave requests</p>
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
            <div>Reason</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          {MOCK_REQUESTS.length > 0 ? (
            <div className="divide-y divide-white/10">
              {MOCK_REQUESTS.map((request) => (
                <div 
                  key={request.id} 
                  className="grid grid-cols-6 gap-4 p-4 items-center text-white transition-all duration-300 hover:bg-white/5 group"
                >
                  <div className="transition-all duration-300 group-hover:translate-x-1">{request.type}</div>
                  <div className="flex items-center gap-2 transition-all duration-300 group-hover:translate-x-1">
                    <Calendar size={16} className="text-white/60 transition-transform duration-300 group-hover:scale-110" />
                    {request.startDate}
                  </div>
                  <div className="flex items-center gap-2 transition-all duration-300 group-hover:translate-x-1">
                    <Calendar size={16} className="text-white/60 transition-transform duration-300 group-hover:scale-110" />
                    {request.endDate}
                  </div>
                  <div className="truncate transition-all duration-300 group-hover:translate-x-1">{request.reason}</div>
                  <div>
                    <span className={cn(
                      "px-2 py-1 text-xs rounded-full transition-all duration-300",
                      request.status === 'Approved' && "bg-green-500/20 text-green-300 group-hover:bg-green-500/30",
                      request.status === 'Pending' && "bg-yellow-500/20 text-yellow-300 group-hover:bg-yellow-500/30",
                      request.status === 'Rejected' && "bg-red-500/20 text-red-300 group-hover:bg-red-500/30"
                    )}>
                      {request.status}
                    </span>
                  </div>
                  <div>
                    <button 
                      onClick={() => handleViewDetails(request)}
                      className="text-sm text-primary-foreground hover:text-primary-foreground/80 bg-primary px-3 py-1 rounded transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-white/60">
              <p>No leave requests found</p>
              <button
                onClick={handleNewRequest}
                className="text-primary hover:text-primary/80 text-sm mt-2"
              >
                Create your first request
              </button>
            </div>
          )}
        </div>

        {/* Mobile View */}
        <div className="sm:hidden space-y-4">
          {MOCK_REQUESTS.length > 0 ? (
            MOCK_REQUESTS.map((request) => (
              <div 
                key={request.id}
                onClick={() => handleViewDetails(request)}
                className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4 space-y-4 cursor-pointer transition-all duration-300 hover:bg-white/5"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-white font-medium">{request.type}</div>
                    <div className="text-sm text-white/60">
                      {calculateDuration(request.startDate, request.endDate)} days
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-white/60" />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="space-y-1">
                    <div className="text-white/60">Start</div>
                    <div className="text-white flex items-center gap-2">
                      <Calendar size={14} className="text-white/60" />
                      {request.startDate}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-white/60">End</div>
                    <div className="text-white flex items-center gap-2">
                      <Calendar size={14} className="text-white/60" />
                      {request.endDate}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={cn(
                    "px-2 py-1 text-xs rounded-full transition-all duration-300",
                    request.status === 'Approved' && "bg-green-500/20 text-green-300",
                    request.status === 'Pending' && "bg-yellow-500/20 text-yellow-300",
                    request.status === 'Rejected' && "bg-red-500/20 text-red-300"
                  )}>
                    {request.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-8 text-center text-white/60">
              <p>No leave requests found</p>
              <button
                onClick={handleNewRequest}
                className="text-primary hover:text-primary/80 text-sm mt-2"
              >
                Create your first request
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-accent rounded-lg w-full max-w-lg relative overflow-hidden">
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-white">Leave Request Details</h3>
                  <p className="text-sm text-white/60">Request #{selectedRequest.id}</p>
                </div>
                <button 
                  onClick={closeDetails}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <span className="text-white/60">Status</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedRequest.status)}
                    <span className={cn(
                      "text-sm",
                      selectedRequest.status === 'Approved' && "text-green-400",
                      selectedRequest.status === 'Pending' && "text-yellow-400",
                      selectedRequest.status === 'Rejected' && "text-red-400"
                    )}>
                      {selectedRequest.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-lg space-y-1">
                    <span className="text-sm text-white/60">Leave Type</span>
                    <p className="text-white font-medium">{selectedRequest.type}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg space-y-1">
                    <span className="text-sm text-white/60">Duration</span>
                    <p className="text-white font-medium">
                      {calculateDuration(selectedRequest.startDate, selectedRequest.endDate)} days
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-lg space-y-2">
                  <span className="text-sm text-white/60">Date Range</span>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-white">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-white/60" />
                      <span>{selectedRequest.startDate}</span>
                    </div>
                    <span className="hidden sm:block text-white/60">to</span>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-white/60" />
                      <span>{selectedRequest.endDate}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-lg space-y-1">
                  <span className="text-sm text-white/60">Reason</span>
                  <p className="text-white">{selectedRequest.reason}</p>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                <button
                  onClick={closeDetails}
                  className="px-4 py-2 text-white/60 hover:text-white transition-colors"
                >
                  Close
                </button>
                {selectedRequest.status === 'Pending' && (
                  <button
                    className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all duration-300"
                  >
                    Cancel Request
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 