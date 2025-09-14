'use client'

interface AuditLog {
  id: string
  action: string
  table: string
  createdAt: Date
  user: {
    username: string
  }
}

interface RecentActivityComponentProps {
  logs: AuditLog[]
}

export function RecentActivityComponent({ logs }: RecentActivityComponentProps) {
  if (logs.length === 0) {
    return <p className="text-gray-500 text-sm">No recent activity</p>
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div key={log.id} className="flex items-center space-x-3 py-2 border-b border-gray-100 last:border-b-0">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {log.user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900">
              <span className="font-medium">{log.user.username}</span> {log.action.toLowerCase()} {log.table.toLowerCase()}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(log.createdAt).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}