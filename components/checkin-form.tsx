'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function CheckinForm() {
  const [formData, setFormData] = useState({
    id_reserva: '',
    id_asiento: '',
    id_puerta: '',
    fecha_checkin: '',
    hora_checkin: '',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.id_reserva || !formData.id_asiento || !formData.id_puerta || !formData.fecha_checkin || !formData.hora_checkin) {
      setMessage({ type: 'error', text: 'Por favor completa todos los campos' })
      return
    }

    try {
      setLoading(true)
      const response = await fetch('http://localhost:3000/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Error al realizar check-in')
      
      setMessage({ type: 'success', text: 'Check-in realizado exitosamente' })
      setFormData({ id_reserva: '', id_asiento: '', id_puerta: '', fecha_checkin: '', hora_checkin: '' })
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al realizar el check-in. Intenta nuevamente.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-pretty mb-2">Realizar Check-in</h1>
        <p className="text-muted-foreground">Completa el check-in de tu vuelo</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos del Check-in</CardTitle>
          <CardDescription>Ingresa la información requerida para el check-in</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">ID Reserva</label>
                <input
                  type="number"
                  name="id_reserva"
                  value={formData.id_reserva}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ej: 1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">ID Asiento</label>
                <input
                  type="text"
                  name="id_asiento"
                  value={formData.id_asiento}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ej: 12A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">ID Puerta</label>
                <input
                  type="text"
                  name="id_puerta"
                  value={formData.id_puerta}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ej: A5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Fecha de Check-in</label>
                <input
                  type="date"
                  name="fecha_checkin"
                  value={formData.fecha_checkin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Hora de Check-in</label>
                <input
                  type="time"
                  name="hora_checkin"
                  value={formData.hora_checkin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {message && (
              <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
                {message.type === 'success' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {loading ? 'Procesando...' : 'Realizar Check-in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
