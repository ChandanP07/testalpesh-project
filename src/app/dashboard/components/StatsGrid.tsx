'use client'

import { 
  Users, 
  Printer, 
  ShoppingCart, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  DollarSign,
  Package
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface StatItem {
  name: string
  value: string | number
  color: string
  href: string
}

interface StatsGridProps {
  stats: StatItem[]
}

const iconMap = {
  'Total Clients': Users,
  'Active Printers': Printer,
  'Pending Orders': ShoppingCart,
  'Open Complaints': AlertTriangle,
  "Today's Orders": Calendar,
  'Monthly Revenue': DollarSign,
  'Low Stock Items': Package,
  'Pending Dispatches': TrendingUp
}

export function StatsGrid({ stats }: StatsGridProps) {
  const router = useRouter()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = iconMap[stat.name as keyof typeof iconMap]
        return (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push(stat.href)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}