'use client'

import { useState, useEffect } from 'react'
import { Plane, Clock, ChevronDown, Search, Filter } from 'lucide-react'
import { fetchAPI, clearCache } from '@/lib/api'
import { filterFlights, paginateArray, getTotalPages, type Flight, type FlightFilters } from '@/lib/flight-filters'

export default function FlightsList() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedFlight, setSelectedFlight] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState<FlightFilters>({
    searchTerm: '',
    status: '',
    date: '',
    aircraft: '',
  })

  useEffect(() => {
    fetchFlights()
  }, [])

  const fetchFlights = async () => {
    try {
      setLoading(true)
      const data = await fetchAPI<Flight[]>('/vuelos')
      setFlights(data)
      setError('')
      setCurrentPage(1)
    } catch (err) {
      setError('No se pudieron cargar los vuelos. Verifica que el servidor esté disponible.')
    } finally {
      setLoading(false)
    }
  }

  const filteredFlights = filterFlights(flights, filters)
  const totalPages = getTotalPages(filteredFlights.length, pageSize)
  const displayedFlights = paginateArray(filteredFlights, currentPage, pageSize)

  const getStatusStyles = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower.includes('retraso')) return 'bg-red-50 text-red-700 border-red-200'
    if (statusLower.includes('cancelado')) return 'bg-red-50 text-red-700 border-red-200'
    if (statusLower.includes('embarque')) return 'bg-accent/10 text-accent border-accent/20'
    return 'bg-green-50 text-green-700 border-green-200'
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setFilters({ searchTerm: '', status: '', date: '', aircraft: '' })
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-border border-t-primary"></div>
      </div>
    )
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Vuelos Disponibles</h1>
          <p className="text-muted-foreground mt-1">Consulta todos los vuelos programados ({filteredFlights.length} total)</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 text-sm font-medium text-primary border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
          <button
            onClick={fetchFlights}
            className="px-4 py-2 text-sm font-medium text-primary border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Actualizar
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase">Buscar Vuelo</label>
              <input
                type="text"
                name="searchTerm"
                value={filters.searchTerm}
                onChange={handleFilterChange}
                placeholder="Ej: AA100"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase">Estado</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              >
                <option value="">Todos</option>
                <option value="confirmado">Confirmado</option>
                <option value="retraso">Retraso</option>
                <option value="cancelado">Cancelado</option>
                <option value="embarque">Embarque</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase">Fecha</label>
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase">Aeronave</label>
              <input
                type="text"
                name="aircraft"
                value={filters.aircraft}
                onChange={handleFilterChange}
                placeholder="Ej: Boeing 737"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex justify-end">
              <button
                onClick={resetFilters}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {filteredFlights.length === 0 && !error ? (
        <div className="text-center py-20">
          <Plane className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
          <p className="text-muted-foreground">No hay vuelos disponibles con los filtros seleccionados</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {displayedFlights.map((flight) => (
              <div
                key={flight.id_vuelo}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setSelectedFlight(selectedFlight === flight.id_vuelo ? null : flight.id_vuelo)}
                  className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Plane className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left min-w-0">
                        <p className="font-semibold text-foreground">{flight.numero_vuelo}</p>
                        <p className="text-sm text-muted-foreground">{flight.aeronave}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-right">
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{flight.hora_salida}</p>
                        <p className="text-xs text-muted-foreground">{flight.fecha_salida}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(flight.estado)}`}>
                        {flight.estado}
                      </div>
                    </div>
                  </div>

                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground flex-shrink-0 ml-4 transition-transform ${
                      selectedFlight === flight.id_vuelo ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {selectedFlight === flight.id_vuelo && (
                  <div className="px-4 py-4 border-t border-border bg-muted/30 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase">Puerta de Embarque</p>
                        <p className="text-lg font-semibold text-foreground mt-1">{flight.puerta_embarque}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase">Vuelo ID</p>
                        <p className="text-lg font-semibold text-foreground mt-1">{flight.id_vuelo}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between py-4">
              <p className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
