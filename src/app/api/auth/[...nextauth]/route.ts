// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Important: Create the handler first
const handler = NextAuth(authOptions)

// Export both GET and POST handlers for the API route
export { handler as GET, handler as POST }

// Export the runtime configuration
export const runtime = 'nodejs'