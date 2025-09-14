// app/api/test/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const userCount = await prisma.user.count()
    
    return NextResponse.json({
      success: true,
      message: 'API is working',
      database: 'connected',
      userCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('API Test Error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'API test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      database: 'disconnected'
    }, { status: 500 })
  }
}