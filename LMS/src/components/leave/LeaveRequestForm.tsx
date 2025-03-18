import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Calendar, Clock, AlertCircle } from 'lucide-react'

interface LeaveRequestFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type LeaveType = 'annual' | 'sick' | 'personal' | 'unpaid'

interface ValidationErrors {
  startDate?: string;
  endDate?: string;
  leaveType?: string;
  reason?: string;
}

export function LeaveRequestForm({ className, ...props }: LeaveRequestFormProps) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [leaveType, setLeaveType] = useState<LeaveType>('annual')
  const [reason, setReason] = useState('')
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock data for available leave balances
  const leaveBalances = {
    annual: 15,
    sick: 10,
    personal: 5,
    unpaid: 'Unlimited'
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}
    
    if (!startDate) {
      newErrors.startDate = 'Start date is required'
    }
    
    if (!endDate) {
      newErrors.endDate = 'End date is required'
    }
    
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = 'End date must be after start date'
    }
    
    if (!reason.trim()) {
      newErrors.reason = 'Reason is required'
    }

    // Calculate leave duration
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

      // Check if requested days exceed available balance
      if (leaveType !== 'unpaid' && diffDays > leaveBalances[leaveType]) {
        newErrors.endDate = `Requested days exceed available ${leaveType} leave balance`
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock success
      alert('Leave request submitted successfully!')
      
      // Reset form
      setStartDate('')
      setEndDate('')
      setLeaveType('annual')
      setReason('')
    } catch (error) {
      alert('Failed to submit leave request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateDuration = () => {
    if (!startDate || !endDate) return null
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    
    return diffDays
  }

  return (
    <div className={cn("min-h-full", className)} {...props}>
      <div className="h-full p-4 sm:p-6 max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">Request Leave</h2>
            <p className="text-sm text-white/60">Submit a new leave request</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <div className="bg-white/10 p-4 sm:p-6 rounded-lg backdrop-blur-sm border border-white/20">
            <div className="text-sm font-medium text-white/60">Annual Leave</div>
            <div className="text-xl sm:text-2xl font-semibold mt-1 text-white">{leaveBalances.annual} days</div>
          </div>
          <div className="bg-white/10 p-4 sm:p-6 rounded-lg backdrop-blur-sm border border-white/20">
            <div className="text-sm font-medium text-white/60">Sick Leave</div>
            <div className="text-xl sm:text-2xl font-semibold mt-1 text-white">{leaveBalances.sick} days</div>
          </div>
          <div className="bg-white/10 p-4 sm:p-6 rounded-lg backdrop-blur-sm border border-white/20">
            <div className="text-sm font-medium text-white/60">Personal Leave</div>
            <div className="text-xl sm:text-2xl font-semibold mt-1 text-white">{leaveBalances.personal} days</div>
          </div>
          <div className="bg-white/10 p-4 sm:p-6 rounded-lg backdrop-blur-sm border border-white/20">
            <div className="text-sm font-medium text-white/60">Unpaid Leave</div>
            <div className="text-xl sm:text-2xl font-semibold mt-1 text-white">{leaveBalances.unpaid}</div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <form onSubmit={handleSubmit} className="divide-y divide-white/10">
            <div className="p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Start Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={cn(
                        "w-full p-2 pr-8 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white transition-all duration-300",
                        errors.startDate && "border-red-400 focus:ring-red-400/30"
                      )}
                      required
                    />
                    <Calendar className="absolute right-2 top-2.5 h-5 w-5 text-white/60" />
                  </div>
                  {errors.startDate && (
                    <div className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <AlertCircle size={12} />
                      {errors.startDate}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">End Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setEndDate(e.target.value)}
                      className={cn(
                        "w-full p-2 pr-8 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white transition-all duration-300",
                        errors.endDate && "border-red-400 focus:ring-red-400/30"
                      )}
                      required
                    />
                    <Calendar className="absolute right-2 top-2.5 h-5 w-5 text-white/60" />
                  </div>
                  {errors.endDate && (
                    <div className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <AlertCircle size={12} />
                      {errors.endDate}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full p-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white transition-all duration-300"
                  required
                >
                  <option value="annual">Annual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="personal">Personal Leave</option>
                  <option value="unpaid">Unpaid Leave</option>
                </select>
                {startDate && endDate && leaveType !== 'unpaid' && (
                  <div className="text-xs text-white/60 flex items-center gap-1 mt-1">
                    <Clock size={12} />
                    Duration: {calculateDuration()} days (Available: {leaveBalances[leaveType]} days)
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Reason</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={cn(
                    "w-full p-2 bg-white/5 border border-white/20 rounded-lg min-h-[100px] focus:outline-none focus:ring-2 focus:ring-white/30 text-white transition-all duration-300",
                    errors.reason && "border-red-400 focus:ring-red-400/30"
                  )}
                  placeholder="Please provide a detailed reason for your leave request..."
                  required
                />
                {errors.reason && (
                  <div className="text-xs text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle size={12} />
                    {errors.reason}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-white/5">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "px-6 py-2 bg-primary text-white rounded-lg transition-all duration-300 hover:bg-primary/90 hover:scale-105 active:scale-95",
                    isSubmitting && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 