export interface Flight {
  id_vuelo: number
  numero_vuelo: string
  fecha_salida: string
  hora_salida: string
  estado: string
  aeronave: string
  puerta_embarque: string
}

export interface FlightFilters {
  searchTerm: string
  status: string
  date: string
  aircraft: string
}

export function filterFlights(flights: Flight[], filters: FlightFilters): Flight[] {
  return flights.filter(flight => {
    // Search by flight number
    if (filters.searchTerm && !flight.numero_vuelo.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false
    }

    // Filter by status
    if (filters.status && !flight.estado.toLowerCase().includes(filters.status.toLowerCase())) {
      return false
    }

    // Filter by date
    if (filters.date && flight.fecha_salida !== filters.date) {
      return false
    }

    // Filter by aircraft
    if (filters.aircraft && !flight.aeronave.toLowerCase().includes(filters.aircraft.toLowerCase())) {
      return false
    }

    return true
  })
}

export function paginateArray<T>(array: T[], page: number, pageSize: number = 10): T[] {
  const startIndex = (page - 1) * pageSize
  return array.slice(startIndex, startIndex + pageSize)
}

export function getTotalPages(totalItems: number, pageSize: number = 10): number {
  return Math.ceil(totalItems / pageSize)
}
