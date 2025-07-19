import { createClient, createServerSupabaseClient } from './supabase'
import type { User } from '@supabase/supabase-js'

/**
 * Get the current user on the client side
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Get the current user on the server side
 */
export async function getCurrentUserServer(): Promise<User | null> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Get user profile from database
 */
export async function getUserProfile(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole)
}

/**
 * Role-based access control
 */
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager', 
  STAFF: 'staff'
} as const

export type UserRole = typeof ROLES[keyof typeof ROLES]

/**
 * Route permissions
 */
export const ROUTE_PERMISSIONS = {
  '/admin': [ROLES.ADMIN],
  '/manager': [ROLES.ADMIN, ROLES.MANAGER],
  '/staff': [ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]
} as const
