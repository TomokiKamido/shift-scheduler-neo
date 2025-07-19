import { redirect } from 'next/navigation'
import { getCurrentUserServer, getUserProfile } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  // Check authentication on server side
  const user = await getCurrentUserServer()
  
  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const profile = await getUserProfile(user.id)
  
  if (!profile) {
    redirect('/login')
  }

  // Get basic stats for dashboard
  const supabase = await createServerSupabaseClient()
  
  // Fetch dashboard data based on user role
  let dashboardData = {
    totalUsers: 0,
    totalShifts: 0,
    pendingRequests: 0,
    upcomingShifts: []
  }

  try {
    if (profile.role === 'admin') {
      // Admin can see all data
      const [usersCount, shiftsCount, requestsCount] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('shifts').select('*', { count: 'exact', head: true }),
        supabase.from('requests').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      ])
      
      dashboardData = {
        totalUsers: usersCount.count || 0,
        totalShifts: shiftsCount.count || 0,
        pendingRequests: requestsCount.count || 0,
        upcomingShifts: []
      }
    } else if (profile.role === 'manager') {
      // Manager can see department data
      const [shiftsCount, requestsCount] = await Promise.all([
        supabase.from('shifts').select('*', { count: 'exact', head: true }).eq('department', profile.department),
        supabase.from('requests').select('*', { count: 'exact', head: true }).eq('department', profile.department).eq('status', 'pending')
      ])
      
      dashboardData = {
        totalUsers: 0,
        totalShifts: shiftsCount.count || 0,
        pendingRequests: requestsCount.count || 0,
        upcomingShifts: []
      }
    } else {
      // Staff can see only their data
      const [shiftsCount, requestsCount] = await Promise.all([
        supabase.from('shifts').select('*', { count: 'exact', head: true }).eq('staff_id', user.id),
        supabase.from('requests').select('*', { count: 'exact', head: true }).eq('staff_id', user.id).eq('status', 'pending')
      ])
      
      dashboardData = {
        totalUsers: 0,
        totalShifts: shiftsCount.count || 0,
        pendingRequests: requestsCount.count || 0,
        upcomingShifts: []
      }
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }

  return (
    <DashboardClient 
      user={user}
      profile={profile}
      dashboardData={dashboardData}
    />
  )
}
