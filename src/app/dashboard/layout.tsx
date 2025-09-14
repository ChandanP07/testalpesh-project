// app/dashboard/layout.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <DashboardLayout currentDate={currentDate}>
      {children}
    </DashboardLayout>
  )
}