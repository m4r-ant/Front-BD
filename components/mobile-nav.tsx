'use client'

import { Plane, FileText, TicketCheck, Luggage, LogIn, Home } from 'lucide-react'

interface MobileNavProps {
  currentPage: string
  onPageChange: (page: string) => void
}

const menuItems = [
  { id: 'flights', label: 'Vuelos', icon: Home },
  { id: 'reservation', label: 'Reserva', icon: FileText },
  { id: 'my-reservations', label: 'Mis Reservas', icon: TicketCheck },
  { id: 'luggage', label: 'Equipaje', icon: Luggage },
  { id: 'checkin', label: 'Check-In', icon: LogIn },
]

export default function MobileNav({ currentPage, onPageChange }: MobileNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 transition-colors ${
                isActive
                  ? 'text-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
