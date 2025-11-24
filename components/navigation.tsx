'use client'

import { Plane, BookOpen, CheckCircle, Luggage, LogIn } from 'lucide-react'

interface NavigationProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export default function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const navItems = [
    { id: 'flights', label: 'Vuelos', icon: Plane },
    { id: 'reservation', label: 'Reserva', icon: BookOpen },
    { id: 'my-reservations', label: 'Mis Reservas', icon: CheckCircle },
    { id: 'luggage', label: 'Equipaje', icon: Luggage },
    { id: 'checkin', label: 'Check-in', icon: LogIn },
  ]

  return (
    <nav className="border-b border-border bg-card shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Plane className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-primary">AeroManage</span>
          </div>
          
          <div className="hidden md:flex gap-1">
            {navItems.map(item => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    currentPage === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>

          <div className="md:hidden flex gap-1 flex-wrap">
            {navItems.map(item => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`p-2 rounded-md transition-colors ${
                    currentPage === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-5 h-5" />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
