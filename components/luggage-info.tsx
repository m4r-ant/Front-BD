'use client'

import { useState } from 'react'
import { Search, Package, ChevronDown } from 'lucide-react'

interface LuggageItem {
  id_equipaje: number
  id_pasajero: number
  descripcion: string
  peso: number
  estado: string
}

export default function LuggageInfo() {
  const [passengerID, setPassengerID] = useState('')
  const [luggage, setLuggage] = useState<LuggageItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)

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

  const getStatusBadge = (estado: string) => {
    const statusLower = estado.toLowerCase()
    if (statusLower.includes('entregado')) return 'bg-green-50 text-green-700 border-green-200'
    if (statusLower.includes('perdido')) return 'bg-red-50 text-red-700 border-red-200'
    return 'bg-blue-50 text-blue-700 border-blue-200'
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Mi Equipaje</h1>
        <p className="text-muted-foreground mt-1">Consulta tu equipaje registrado</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="flex-1">
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
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      {searched && luggage.length > 0 && (
        <>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
            <p className="text-sm font-medium text-muted-foreground uppercase mb-2">Peso Total del Equipaje</p>
            <p className="text-3xl font-bold text-primary">{getTotalWeight()} kg</p>
          </div>

          <div className="space-y-3">
            {luggage.map((item) => (
              <div
                key={item.id_equipaje}
                className="bg-card border border-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(expandedId === item.id_equipaje ? null : item.id_equipaje)}
                  className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="font-semibold text-foreground truncate">{item.descripcion}</p>
                      <p className="text-sm text-muted-foreground">{item.peso} kg</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(item.estado)}`}>
                      {item.estado}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
                        expandedId === item.id_equipaje ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {expandedId === item.id_equipaje && (
                  <div className="px-4 py-4 border-t border-border bg-muted/30">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase">ID Equipaje</p>
                        <p className="text-lg font-semibold text-foreground mt-1">{item.id_equipaje}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase">ID Pasajero</p>
                        <p className="text-lg font-semibold text-foreground mt-1">{item.id_pasajero}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {searched && luggage.length === 0 && !error && (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
          <p className="text-muted-foreground">No hay equipaje registrado para este pasajero</p>
        </div>
      )}
    </div>
  )
}
