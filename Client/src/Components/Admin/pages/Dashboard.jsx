import StatsGrid from '../dashboard/StatsGrid'
import RecentAppointments from '../dashboard/RecentAppointments'
import ActivityChart from '../dashboard/ActivityChart'
import AppointmentsTable from '../appointments/AppointmentsTable'
export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
      
      <StatsGrid />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityChart />
        </div>
        <div>
          <RecentAppointments />
        </div>
      </div>
    </div>
  )
}