import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getCurrentUserServer } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUserServer()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')
    const staffId = searchParams.get('staff_id')

    let query = supabase.from('shifts').select(`
      *,
      profiles:staff_id (
        name,
        department
      )
    `)

    // Apply filters based on user role and query parameters
    if (department) {
      query = query.eq('department', department)
    }

    if (staffId) {
      query = query.eq('staff_id', staffId)
    }

    // Order by date
    query = query.order('date', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching shifts:', error)
      return NextResponse.json({ error: 'Failed to fetch shifts' }, { status: 500 })
    }

    return NextResponse.json({ shifts: data })
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

    const body = await request.json()
    const { date, start_time, end_time, staff_id, department, shift_type } = body

    // Validate required fields
    if (!date || !start_time || !end_time || !staff_id || !department || !shift_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('shifts')
      .insert({
        date,
        start_time,
        end_time,
        staff_id,
        department,
        shift_type,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating shift:', error)
      return NextResponse.json({ error: 'Failed to create shift' }, { status: 500 })
    }

    return NextResponse.json({ shift: data }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
