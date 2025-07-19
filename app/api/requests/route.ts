import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getCurrentUserServer, getUserProfile } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUserServer()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await getUserProfile(user.id)
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const department = searchParams.get('department')

    let query = supabase.from('requests').select(`
      *,
      profiles:staff_id (
        name,
        department
      )
    `)

    // Apply role-based filtering
    if (profile.role === 'staff') {
      // Staff can only see their own requests
      query = query.eq('staff_id', user.id)
    } else if (profile.role === 'manager') {
      // Manager can see requests from their department
      query = query.eq('department', profile.department)
    }
    // Admin can see all requests (no additional filter)

    // Apply optional filters
    if (status) {
      query = query.eq('status', status)
    }

    if (department && profile.role === 'admin') {
      query = query.eq('department', department)
    }

    // Order by creation date (newest first)
    query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching requests:', error)
      return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 })
    }

    return NextResponse.json({ requests: data })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserServer()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await getUserProfile(user.id)
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const { type, date, reason } = body

    // Validate required fields
    if (!type || !date || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate type
    if (!['vacation', 'substitute'].includes(type)) {
      return NextResponse.json({ error: 'Invalid request type' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('requests')
      .insert({
        type,
        staff_id: user.id,
        department: profile.department,
        date,
        reason,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating request:', error)
      return NextResponse.json({ error: 'Failed to create request' }, { status: 500 })
    }

    return NextResponse.json({ request: data }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUserServer()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await getUserProfile(user.id)
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Only managers and admins can approve/reject requests
    if (!['admin', 'manager'].includes(profile.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { request_id, status } = body

    // Validate required fields
    if (!request_id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate status
    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    // Check if the request exists and user has permission to modify it
    const { data: existingRequest, error: fetchError } = await supabase
      .from('requests')
      .select('*')
      .eq('id', request_id)
      .single()

    if (fetchError || !existingRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    // Manager can only approve requests from their department
    if (profile.role === 'manager' && existingRequest.department !== profile.department) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', request_id)
      .select()
      .single()

    if (error) {
      console.error('Error updating request:', error)
      return NextResponse.json({ error: 'Failed to update request' }, { status: 500 })
    }

    return NextResponse.json({ request: data })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
