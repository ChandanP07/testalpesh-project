// middleware.ts (in root directory)
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Check if user is trying to access admin routes
    if (pathname.startsWith('/dashboard/admin') && token?.role !== 'ADMIN') {
      return NextResponse.rewrite(new URL('/dashboard/unauthorized', req.url))
    }

    // Check if user is trying to access manager routes
    if (pathname.startsWith('/dashboard/mis') && !['ADMIN', 'MANAGER'].includes(token?.role as string)) {
      return NextResponse.rewrite(new URL('/dashboard/unauthorized', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow access to login page without token
        if (pathname === '/login') return true
        
        // Require token for dashboard routes
        if (pathname.startsWith('/dashboard')) return !!token
        
        return true
      },
    },
  }
)

export const config = {
  // matcher: ['/dashboard/:path*', '/login']
  matcher: ['/dashboard/:path*'] 
}