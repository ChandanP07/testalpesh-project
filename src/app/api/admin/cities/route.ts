// app/api/admin/cities/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// First, let's add the City model to our schema (this would go in schema.prisma)
/*
model City {
  id        String   @id @default(cuid())
  name      String   @unique
  state     String
  country   String   @default("India")
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  clients   Client[]
  
  @@map("cities")
}
*/

// GET - Fetch all cities
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For now, return a mock response since we don't have the City table yet
    // In production, this would be:
    // const cities = await prisma.city.findMany({
    //   orderBy: [{ state: 'asc' }, { name: 'asc' }]
    // })

    const mockCities = [
      { id: '1', name: 'Mumbai', state: 'Maharashtra', country: 'India', isActive: true },
      { id: '2', name: 'Pune', state: 'Maharashtra', country: 'India', isActive: true },
      { id: '3', name: 'Andheri', state: 'Maharashtra', country: 'India', isActive: true },
      { id: '4', name: 'Delhi', state: 'Delhi', country: 'India', isActive: true },
      { id: '5', name: 'Bangalore', state: 'Karnataka', country: 'India', isActive: true },
      { id: '6', name: 'Chennai', state: 'Tamil Nadu', country: 'India', isActive: true },
      { id: '7', name: 'Hyderabad', state: 'Telangana', country: 'India', isActive: true },
      { id: '8', name: 'Kolkata', state: 'West Bengal', country: 'India', isActive: true }
    ]

    return NextResponse.json({ cities: mockCities })
  } catch (error) {
    console.error('Error fetching cities:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new city
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, state, country = 'India' } = body

    if (!name || !state) {
      return NextResponse.json(
        { error: 'City name and state are required' },
        { status: 400 }
      )
    }

    // For now, return a mock response
    // In production, this would create the city in the database
    const newCity = {
      id: Date.now().toString(),
      name: name.trim(),
      state: state.trim(),
      country: country.trim(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE_CITY',
        table: 'cities',
        recordId: newCity.id,
        newValues: {
          name: newCity.name,
          state: newCity.state,
          country: newCity.country
        }
      }
    })

    return NextResponse.json({
      message: 'City added successfully',
      city: newCity
    })
  } catch (error) {
    console.error('Error creating city:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update existing city
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, state, country, isActive } = body

    if (!id) {
      return NextResponse.json({ error: 'City ID is required' }, { status: 400 })
    }

    // For now, return a mock response
    const updatedCity = {
      id,
      name: name?.trim(),
      state: state?.trim(),
      country: country?.trim() || 'India',
      isActive: isActive !== undefined ? isActive : true,
      updatedAt: new Date()
    }

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE_CITY',
        table: 'cities',
        recordId: id,
        newValues: {
          name: updatedCity.name,
          state: updatedCity.state,
          country: updatedCity.country,
          isActive: updatedCity.isActive
        }
      }
    })

    return NextResponse.json({
      message: 'City updated successfully',
      city: updatedCity
    })
  } catch (error) {
    console.error('Error updating city:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete city
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const cityId = searchParams.get('id')

    if (!cityId) {
      return NextResponse.json({ error: 'City ID is required' }, { status: 400 })
    }

    // Check if city is being used by any clients
    const clientCount = await prisma.client.count({
      where: { city: cityId }
    })

    if (clientCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete city. It is being used by ${clientCount} client(s)` },
        { status: 400 }
      )
    }

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE_CITY',
        table: 'cities',
        recordId: cityId,
        oldValues: {
          cityId: cityId,
          deletedBy: session.user.username
        }
      }
    })

    return NextResponse.json({
      message: 'City deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting city:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}