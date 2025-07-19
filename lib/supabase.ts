import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr'

/**
 * Create a Supabase client for use in the browser
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Create a Supabase client for use on the server (App Router)
 */
export async function createServerSupabaseClient() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

/**
 * Create a Supabase client for use in middleware
 */
export function createMiddlewareClient(request: Request) {
  let response = new Response()

  return {
    supabase: createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            const cookieStore = request.headers.get('cookie')
            if (!cookieStore) return []
            
            return cookieStore.split(';').map(cookie => {
              const [name, value] = cookie.trim().split('=')
              return { name, value }
            })
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.headers.append('Set-Cookie', `${name}=${value}; ${Object.entries(options || {}).map(([k, v]) => `${k}=${v}`).join('; ')}`)
            })
          },
        },
      }
    ),
    response
  }
}

// Types for the application
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'manager' | 'staff'
          department: string
          employee_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'admin' | 'manager' | 'staff'
          department: string
          employee_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'manager' | 'staff'
          department?: string
          employee_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      departments: {
        Row: {
          id: number
          name: string
          work_system: string
          member_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          work_system: string
          member_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          work_system?: string
          member_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      shifts: {
        Row: {
          id: number
          date: string
          start_time: string
          end_time: string
          staff_id: string
          department: string
          shift_type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          date: string
          start_time: string
          end_time: string
          staff_id: string
          department: string
          shift_type: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          date?: string
          start_time?: string
          end_time?: string
          staff_id?: string
          department?: string
          shift_type?: string
          created_at?: string
          updated_at?: string
        }
      }
      requests: {
        Row: {
          id: number
          type: 'vacation' | 'substitute'
          staff_id: string
          department: string
          date: string
          status: 'pending' | 'approved' | 'rejected'
          reason: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          type: 'vacation' | 'substitute'
          staff_id: string
          department: string
          date: string
          status?: 'pending' | 'approved' | 'rejected'
          reason: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          type?: 'vacation' | 'substitute'
          staff_id?: string
          department?: string
          date?: string
          status?: 'pending' | 'approved' | 'rejected'
          reason?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
