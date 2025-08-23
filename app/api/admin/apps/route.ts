import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { APP_CONFIGS } from '@/lib/app-configs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // For now, return APP_CONFIGS since we don't have an apps table yet
    // In the future, we could try to fetch from database first and fall back to APP_CONFIGS
    
    return NextResponse.json({
      success: true,
      apps: APP_CONFIGS
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

    // For now, since we don't have an apps table, we'll simulate success
    // In production, you would add the app to APP_CONFIGS programmatically
    // or store in a database table
    
    const newApp = {
      id: slug,
      name,
      description,
      icon,
      color,
      href: `/dashboard/${slug}`,
      requiredRoles: requiredRoles || [`${slug}-admin`, `${slug}-member`],
      features: features || [],
      status: status || 'development',
      isActive: true,
      created_at: new Date().toISOString()
    }

    // TODO: Add app to APP_CONFIGS or database
    console.log('New app would be created:', newApp)
    console.log('NOTE: To complete onboarding, add this app to lib/app-configs.ts')

    return NextResponse.json({
      success: true,
      message: 'Application configuration generated. Please add to APP_CONFIGS to activate.',
      app: newApp,
      instructions: {
        step1: 'Add the following configuration to lib/app-configs.ts',
        config: newApp
      }
    })

  } catch (error) {
    console.error('App creation error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create application'
    }, { status: 500 })
  }
}