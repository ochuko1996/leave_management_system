import { LeaveRequestForm } from '@/components/leave/LeaveRequestForm'

export function DashboardPage() {
  return (
    <div className="h-[calc(100vh-2rem)] bg-gradient-to-br from-accent to-accent/90 rounded-lg overflow-auto">
      <LeaveRequestForm />
    </div>
  )
} 