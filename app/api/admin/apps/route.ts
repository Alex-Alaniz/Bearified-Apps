import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Get all apps from the database
    const { data: apps, error } = await supabase
      .from('apps')
      .select('*')
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      slug,
      icon,
      color,
      status,
      features,
      requiredRoles
    } = body

    // Validate required fields
    if (!name || !description || !slug) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: name, description, and slug are required'
      }, { status: 400 })
    }

    // Create the app record
    const appData = {
      name,
      description,
      slug,
      icon,
      color,
      status,
      features: features || [],
      required_roles: requiredRoles || [],
      is_active: status === 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: newApp, error } = await supabase
      .from('apps')
      .insert([appData])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create app: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Application created successfully',
      app: newApp
    })

  } catch (error) {
    console.error('App creation error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create application'
    }, { status: 500 })
  }
}