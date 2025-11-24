'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

export default function CheckIn() {
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
      setTimeout(() => setMessage(null), 4000)
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al realizar el check-in. Intenta nuevamente.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Realizar Check-in</h1>
        <p className="text-muted-foreground mt-1">Completa el check-in de tu vuelo</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">ID Reserva</label>
              <input
                type="number"
                name="id_reserva"
                value={formData.id_reserva}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                placeholder="Ej: 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">ID Asiento</label>
              <input
                type="text"
                name="id_asiento"
                value={formData.id_asiento}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                placeholder="Ej: 12A"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">ID Puerta</label>
              <input
                type="text"
                name="id_puerta"
                value={formData.id_puerta}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                placeholder="Ej: A5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Fecha de Check-in</label>
              <input
                type="date"
                name="fecha_checkin"
                value={formData.fecha_checkin}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Hora de Check-in</label>
              <input
                type="time"
                name="hora_checkin"
                value={formData.hora_checkin}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              />
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg text-sm font-medium flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.type === 'success' && <CheckCircle className="w-4 h-4" />}
              {message.text}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Procesando...' : 'Realizar Check-in'}
          </button>
        </form>
      </div>
    </div>
  )
}
