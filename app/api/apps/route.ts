import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Get active apps from the database
    const { data: apps, error } = await supabase
      .from('apps')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch apps: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      apps: apps || []
    })

  } catch (error) {
    console.error('Apps fetch error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch apps'
    }, { status: 500 })
  }
}