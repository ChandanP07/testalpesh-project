// app/dashboard/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Suspense } from 'react'
import { StatsGrid } from './components/StatsGrid'
import { RecentOrdersComponent } from './components/RecentOrders'
import { RecentActivityComponent } from './components/RecentActivity'
import { QuickActionButton } from './components/QuickActionButton'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return <div>Access denied</div>
  }

  // Fetch all data on the server
  const [
    totalClients,
    totalPrinters,
    pendingOrders,
    openComplaints,
    todayOrders,
    monthlyRevenue,
    lowStockCartridges,
    pendingDispatches,
    recentOrders,
    recentLogs
  ] = await Promise.all([
    prisma.client.count({ where: { isActive: true } }),
    prisma.clientPrinter.count({ where: { isActive: true } }),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.complaint.count({ where: { status: { in: ['OPEN', 'ASSIGNED', 'IN_PROGRESS'] } } }),
    prisma.order.count({
      where: {
        orderDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }
    }),
    prisma.bill.aggregate({
      _sum: { totalAmount: true },
      where: {
        billDate: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
        },
        status: 'PAID'
      }
    }),
    prisma.cartridge.count({ where: { condition: 'EMPTY' } }),
    prisma.dispatch.count({ where: { status: 'PENDING' } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { client: true }
    }),
    prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    })
  ])

  const statsData = [
    {
      name: 'Total Clients',
      value: totalClients,
      color: 'bg-blue-500',
      href: '/dashboard/clients'
    },
    {
      name: 'Active Printers',
      value: totalPrinters,
      color: 'bg-green-500',
      href: '/dashboard/printers'
    },
    {
      name: 'Pending Orders',
      value: pendingOrders,
      color: 'bg-yellow-500',
      href: '/dashboard/orders'
    },
    {
      name: 'Open Complaints',
      value: openComplaints,
      color: 'bg-red-500',
      href: '/dashboard/complaints'
    },
    {
      name: "Today's Orders",
      value: todayOrders,
      color: 'bg-purple-500',
      href: '/dashboard/orders'
    },
    {
      name: 'Monthly Revenue',
      value: `₹${monthlyRevenue._sum.totalAmount?.toLocaleString('en-IN') || '0'}`,
      color: 'bg-emerald-500',
      href: '/dashboard/billing'
    },
    {
      name: 'Low Stock Items',
      value: lowStockCartridges,
      color: 'bg-orange-500',
      href: '/dashboard/inventory'
    },
    {
      name: 'Pending Dispatches',
      value: pendingDispatches,
      color: 'bg-indigo-500',
      href: '/dashboard/dispatch'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {session.user.username}!</h1>
        <p className="text-blue-100">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <Suspense fallback={<StatsLoadingSkeleton />}>
        <StatsGrid stats={statsData} />
      </Suspense>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            <RecentOrdersComponent orders={recentOrders} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <QuickActionButton
              title="New Order"
              href="/dashboard/orders/new"
              color="bg-blue-500 hover:bg-blue-600"
            />
            <QuickActionButton
              title="New Client"
              href="/dashboard/clients/new"
              color="bg-green-500 hover:bg-green-600"
            />
            <QuickActionButton
              title="New Complaint"
              href="/dashboard/complaints/new"
              color="bg-red-500 hover:bg-red-600"
            />
            <QuickActionButton
              title="View Reports"
              href="/dashboard/mis"
              color="bg-purple-500 hover:bg-purple-600"
            />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <RecentActivityComponent logs={recentLogs} />
      </div>
    </div>
  )
}

// Loading skeleton
function StatsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-12 w-12 bg-gray-200 rounded-full ml-auto"></div>
          </div>
        </div>
      ))}
    </div>
  )
}