'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface Reservation {
  id_reserva: number
  id_pasajero: number
  id_vuelo: number
  codigo_reserva: string
  estado: string
  precio: number
}

export default function PassengerReservations() {
  const [passengerID, setPassengerID] = useState('')
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!passengerID) {
      setError('Por favor ingresa un ID de pasajero')
      return
    }

    try {
      setLoading(true)
      setError('')
      const response = await fetch(`http://localhost:3000/reservas/${passengerID}`)
      if (!response.ok) throw new Error('Pasajero no encontrado')
      const data = await response.json()
      setReservations(data)
      setSearched(true)
    } catch (err) {
      setError('No se encontraron reservas para este pasajero')
      setReservations([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-pretty mb-2">Mis Reservas</h1>
        <p className="text-muted-foreground">Consulta tus reservas usando tu ID de pasajero</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar Reservas</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-3 flex-col sm:flex-row">
            <input
              type="number"
              value={passengerID}
              onChange={(e) => setPassengerID(e.target.value)}
              placeholder="Ingresa tu ID de pasajero"
              className="flex-1 px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {searched && reservations.length > 0 && (
        <div className="grid gap-4">
          {reservations.map(res => (
            <Card key={res.id_reserva}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{res.codigo_reserva}</CardTitle>
                    <CardDescription>Vuelo ID: {res.id_vuelo}</CardDescription>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    res.estado === 'confirmada' ? 'bg-green-100 text-green-800' :
                    res.estado === 'cancelada' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {res.estado}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <p><span className="font-semibold">Reserva ID:</span> {res.id_reserva}</p>
                  <p><span className="font-semibold">Precio:</span> ${res.precio.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {searched && reservations.length === 0 && !error && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No hay reservas para este pasajero</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
