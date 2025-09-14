'use client'

interface QuickActionButtonProps {
  title: string
  href: string 
  color: string 
}

export function QuickActionButton({ title, href, color }: QuickActionButtonProps) {
  return (
    <a
      href={href}
      className={`${color} text-white p-4 rounded-lg text-center font-medium transition-colors`}
    >
      {title}
    </a>
  )
}