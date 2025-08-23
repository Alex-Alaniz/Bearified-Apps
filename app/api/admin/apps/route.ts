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

    // Create the app configuration
    const newApp = {
      id: slug,
      name,
      description,
      icon: icon || 'Package',
      color: color || 'from-blue-500 to-purple-600',
      href: `/dashboard/${slug}`,
      requiredRoles: requiredRoles || [`${slug}-admin`, `${slug}-member`],
      features: features || [],
      status: status || 'development',
      isActive: true,
      created_at: new Date().toISOString()
    }

    try {
      // Add app to APP_CONFIGS using the script
      const { exec } = require('child_process')
      const util = require('util')
      const execAsync = util.promisify(exec)
      
      const scriptPath = require('path').join(process.cwd(), 'scripts', 'add-app-to-configs.js')
      const command = `node "${scriptPath}" '${JSON.stringify(newApp)}'`
      
      const { stdout, stderr } = await execAsync(command)
      
      if (stderr && !stderr.includes('DeprecationWarning')) {
        throw new Error(stderr)
      }
      
      console.log('✅ App added to APP_CONFIGS:', stdout)
      
      return NextResponse.json({
        success: true,
        message: 'Application created successfully and added to system configuration.',
        app: newApp,
        note: 'Please restart the development server to see the new app in the dashboard.'
      })
      
    } catch (scriptError) {
      console.error('❌ Error adding app to configs:', scriptError)
      
      // Fall back to manual instructions
      return NextResponse.json({
        success: true,
        message: 'Application configuration generated. Manual setup required.',
        app: newApp,
        instructions: {
          step1: 'Add the following configuration to lib/app-configs.ts manually:',
          config: newApp,
          error: scriptError.message
        }
      })
    }

  } catch (error) {
    console.error('App creation error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create application'
    }, { status: 500 })
  }
}