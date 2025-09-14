// components/DebugInfo.tsx (for development only)
'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

export default function DebugInfo() {
  const { data: session, status } = useSession()
  const [apiStatus, setApiStatus] = useState<any>(null)
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Test API connection
      fetch('/api/test')
        .then(res => res.json())
        .then(data => setApiStatus(data))
        .catch(err => setApiStatus({ error: err.message }))
    }
  }, [])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">🐛 Debug Info</h3>
      <div className="space-y-1">
        <div><strong>NextAuth Status:</strong> {status}</div>
        <div><strong>Session:</strong> {session ? '✅ Active' : '❌ None'}</div>
        <div><strong>User:</strong> {session?.user?.username || 'N/A'}</div>
        <div><strong>Role:</strong> {session?.user?.role || 'N/A'}</div>
        <div><strong>API Test:</strong> {apiStatus?.success ? '✅ OK' : '❌ Error'}</div>
        <div><strong>Database:</strong> {apiStatus?.database || 'Unknown'}</div>
        {apiStatus?.error && (
          <div className="text-red-400"><strong>Error:</strong> {apiStatus.error}</div>
        )}
      </div>
      <div className="mt-2 text-xs opacity-75">
        Environment: {process.env.NODE_ENV}
      </div>
    </div>
  )
}