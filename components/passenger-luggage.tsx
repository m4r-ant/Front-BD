'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Luggage } from 'lucide-react'

interface LuggageItem {
  id_equipaje: number
  id_pasajero: number
  descripcion: string
  peso: number
  estado: string
}

export default function PassengerLuggage() {
  const [passengerID, setPassengerID] = useState('')
  const [luggage, setLuggage] = useState<LuggageItem[]>([])
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
      const response = await fetch(`http://localhost:3000/equipaje/${passengerID}`)
      if (!response.ok) throw new Error('Equipaje no encontrado')
      const data = await response.json()
      setLuggage(data)
      setSearched(true)
    } catch (err) {
      setError('No se encontró equipaje para este pasajero')
      setLuggage([])
    } finally {
      setLoading(false)
    }
  }

  const getTotalWeight = () => {
    return luggage.reduce((sum, item) => sum + item.peso, 0).toFixed(2)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-pretty mb-2">Mi Equipaje</h1>
        <p className="text-muted-foreground">Consulta tu equipaje registrado</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar Equipaje</CardTitle>
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

      {searched && luggage.length > 0 && (
        <>
          <Card className="border-accent border-2">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground">Peso Total del Equipaje</p>
                <p className="text-3xl font-bold text-primary">{getTotalWeight()} kg</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {luggage.map(item => (
              <Card key={item.id_equipaje}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <Luggage className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <CardTitle className="text-lg">{item.descripcion}</CardTitle>
                      <CardDescription>ID: {item.id_equipaje}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <p><span className="font-semibold">Peso:</span> {item.peso} kg</p>
                    <p><span className="font-semibold">Estado:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-sm font-semibold ${
                        item.estado === 'entregado' ? 'bg-green-100 text-green-800' :
                        item.estado === 'perdido' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {item.estado}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {searched && luggage.length === 0 && !error && (
        <Card>
          <CardContent className="text-center py-12">
            <Luggage className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No hay equipaje registrado para este pasajero</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
