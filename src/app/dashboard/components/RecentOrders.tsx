'use client'

interface Order {
  id: string
  orderNumber: string
  status: string
  client: {
    companyName: string
  }
}

interface RecentOrdersComponentProps {
  orders: Order[]
}

export function RecentOrdersComponent({ orders }: RecentOrdersComponentProps) {
  if (orders.length === 0) {
    return <p className="text-gray-500 text-sm">No recent orders</p>
  }

  return (
    <>
      {orders.map((order) => (
        <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
          <div>
            <p className="font-medium text-sm">{order.orderNumber}</p>
            <p className="text-gray-500 text-xs">{order.client.companyName}</p>
          </div>
          <div className="text-right">
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
              order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {order.status}
            </span>
          </div>
        </div>
      ))}
    </>
  )
}