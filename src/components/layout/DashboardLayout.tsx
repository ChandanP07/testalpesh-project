// components/layout/DashboardLayout.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { 
  Home, 
  Settings, 
  BarChart3, 
  Users, 
  Printer, 
  Phone, 
  Truck, 
  Receipt,
  TrendingUp,
  FileText,
  AlertCircle,
  Clock,
  Menu,
  X,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface DashboardLayoutProps {
  children: React.ReactNode
  currentDate?: string // Add this prop
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Admin', href: '/dashboard/admin', icon: Settings },
  { name: 'MIS Reports', href: '/dashboard/mis', icon: BarChart3 },
  { name: 'Clients', href: '/dashboard/clients', icon: Users },
  { name: 'Printers', href: '/dashboard/printers', icon: Printer },
  { name: 'Complaints', href: '/dashboard/complaints', icon: Phone },
  { name: 'Dispatch', href: '/dashboard/dispatch', icon: Truck },
  { name: 'Billing', href: '/dashboard/billing', icon: Receipt },
  { name: 'Marketing', href: '/dashboard/marketing', icon: TrendingUp },
  { name: 'New Order', href: '/dashboard/orders/new', icon: FileText },
  { name: 'New Complaint', href: '/dashboard/complaints/new', icon: AlertCircle },
  { name: 'Pending Work', href: '/dashboard/pending', icon: Clock },
]

export default function DashboardLayout({ children, currentDate }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [clientDate, setClientDate] = useState(currentDate || '')
  const { data: session } = useSession()
  const pathname = usePathname()

  useEffect(() => {
    // Update the date on the client side to ensure consistency
    if (!currentDate) {
      // If no server date provided, format on client
      setClientDate(
        new Date().toLocaleDateString('en-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      )
    } else {
      // Use the server date initially, then update on client if needed
      setClientDate(currentDate)
      
      // Optional: Update to client's exact time if needed
      const clientFormattedDate = new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      
      if (clientFormattedDate !== currentDate) {
        setClientDate(clientFormattedDate)
      }
    }
  }, [currentDate])

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <SidebarContent navigation={navigation} pathname={pathname} onLogout={handleLogout} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <SidebarContent navigation={navigation} pathname={pathname} onLogout={handleLogout} />
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Page header */}
        <div className="bg-white shadow">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {session?.user?.username}!
                  </h1>
                  <p className="text-gray-600">
                    Last login: {session?.user?.lastLogin ? new Date(session.user.lastLogin).toLocaleString() : 'First time'}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    {clientDate || (
                      <span className="inline-block h-4 w-40 bg-gray-200 animate-pulse rounded"></span>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <LogOut className="h-4 w-4 inline mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

function SidebarContent({ 
  navigation, 
  pathname, 
  onLogout 
}: { 
  navigation: typeof navigation
  pathname: string
  onLogout: () => void 
}) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-xl font-bold text-indigo-600">PrintCare</h1>
        </div>
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-900 border-r-2 border-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 transition-colors ${
                    isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="group flex items-center px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md w-full transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign out
        </button>
      </div>
    </div>
  )
}