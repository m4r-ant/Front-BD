'use client'

import { Plane, FileText, TicketCheck, Luggage, LogIn, Home } from 'lucide-react'

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

const menuItems = [
  { id: 'flights', label: 'Vuelos', icon: Home },
  { id: 'reservation', label: 'Nueva Reserva', icon: FileText },
  { id: 'my-reservations', label: 'Mis Reservas', icon: TicketCheck },
  { id: 'luggage', label: 'Equipaje', icon: Luggage },
  { id: 'checkin', label: 'Check-In', icon: LogIn },
]

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Plane className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">AeroManage</h2>
            <p className="text-xs text-muted-foreground">Gestión de Vuelos</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-primary-foreground font-semibold shadow-md'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          © 2025 AeroManage
        </p>
      </div>
    </aside>
  )
}
