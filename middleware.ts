import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from './lib/supabase'

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = createMiddlewareClient(request)
    
    // Refresh session if expired - required for Server Components
    const { data: { session } } = await supabase.auth.getSession()
    
    const url = request.nextUrl.clone()
    
    // Skip middleware for static files and API routes in production
    if (
      url.pathname.startsWith('/_next') ||
      url.pathname.startsWith('/api') ||
      url.pathname.includes('.') ||
      url.pathname === '/favicon.ico'
    ) {
      return NextResponse.next()
    }
    
    // Protected routes that require authentication
    const protectedPaths = ['/admin', '/manager', '/staff', '/dashboard']
    const isProtectedPath = protectedPaths.some(path => url.pathname.startsWith(path))
    
    // If accessing protected route without session, redirect to login
    if (isProtectedPath && !session) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    
    // If logged in and trying to access login/signup, redirect to dashboard
    if (session && (url.pathname === '/login' || url.pathname === '/signup')) {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
    
    // Role-based access control
    if (session && isProtectedPath) {
      // Get user profile to check role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
      
      if (profile) {
        const userRole = profile.role
        const path = url.pathname
        
        // Admin routes
        if (path.startsWith('/admin') && userRole !== 'admin') {
          url.pathname = '/unauthorized'
          return NextResponse.redirect(url)
        }
        
        // Manager routes (admin and manager can access)
        if (path.startsWith('/manager') && !['admin', 'manager'].includes(userRole)) {
          url.pathname = '/unauthorized'
          return NextResponse.redirect(url)
        }
        
        // Staff routes (all roles can access)
        // No additional restrictions for staff routes
      }
    }
    
    return response
  } catch (e) {
    // If an error occurred, redirect to login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|api|public).*)',
  ],
}
