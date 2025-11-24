'use client'

import { useState } from 'react'
import { Search, ChevronDown, AlertCircle } from 'lucide-react'
import { fetchAPI, clearCache } from '@/lib/api'

interface Reservation {
  id_reserva: number
  id_pasajero: number
  id_vuelo: number
  codigo_reserva: string
  estado: string
  precio: number
}

export default function MyReservations() {
  const [passengerID, setPassengerID] = useState('')
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!passengerID) {
      setError('Por favor ingresa un ID de pasajero')
      return
    }

    try {
      setLoading(true)
      setError('')
      const data = await fetchAPI<Reservation[]>(`/reservas/${passengerID}`)
      setReservations(data)
      setSearched(true)
    } catch (err) {
      setError('No se encontraron reservas para este pasajero. Verifica el ID e intenta nuevamente.')
      setReservations([])
    } finally {
      setLoading(false)
    }
  }

  const filteredReservations = statusFilter
    ? reservations.filter(r => r.estado.toLowerCase().includes(statusFilter.toLowerCase()))
    : reservations

  const getStatusBadge = (estado: string) => {
    const statusLower = estado.toLowerCase()
    if (statusLower.includes('confirmada')) return 'bg-green-50 text-green-700 border-green-200'
    if (statusLower.includes('cancelada')) return 'bg-red-50 text-red-700 border-red-200'
    return 'bg-yellow-50 text-yellow-700 border-yellow-200'
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Mis Reservas</h1>
        <p className="text-muted-foreground mt-1">Consulta tus reservas usando tu ID de pasajero</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="number"
            value={passengerID}
            onChange={(e) => setPassengerID(e.target.value)}
            placeholder="Ingresa tu ID de pasajero"
            className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium flex gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {searched && reservations.length > 0 && (
        <>
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === ''
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-border'
              }`}
            >
              Todas ({reservations.length})
            </button>
            <button
              onClick={() => setStatusFilter('confirmada')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === 'confirmada'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-muted text-muted-foreground hover:bg-border'
              }`}
            >
              Confirmadas
            </button>
            <button
              onClick={() => setStatusFilter('cancelada')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === 'cancelada'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-muted text-muted-foreground hover:bg-border'
              }`}
            >
              Canceladas
            </button>
          </div>

          <div className="space-y-3">
            {filteredReservations.map((res) => (
              <div
                key={res.id_reserva}
                className="bg-card border border-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(expandedId === res.id_reserva ? null : res.id_reserva)}
                  className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="text-left min-w-0">
                      <p className="font-semibold text-foreground">{res.codigo_reserva}</p>
                      <p className="text-sm text-muted-foreground">Vuelo ID: {res.id_vuelo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(res.estado)}`}>
                      {res.estado}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
                        expandedId === res.id_reserva ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {expandedId === res.id_reserva && (
                  <div className="px-4 py-4 border-t border-border bg-muted/30 space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase">Precio</p>
                        <p className="text-lg font-semibold text-foreground mt-1">${res.precio.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase">Reserva ID</p>
                        <p className="text-lg font-semibold text-foreground mt-1">{res.id_reserva}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {searched && reservations.length === 0 && !error && (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <p className="text-muted-foreground">No hay reservas para este pasajero</p>
        </div>
      )}
    </div>
  )
}
