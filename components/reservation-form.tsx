'use client'

import { useState } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { fetchAPI, clearCache } from '@/lib/api'

export default function ReservationForm() {
  const [formData, setFormData] = useState({
    id_pasajero: '',
    id_vuelo: '',
    codigo_reserva: '',
    estado: 'confirmada',
    precio: '',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.id_pasajero) newErrors.id_pasajero = 'ID de pasajero requerido'
    if (!formData.id_vuelo) newErrors.id_vuelo = 'ID de vuelo requerido'
    if (!formData.codigo_reserva) newErrors.codigo_reserva = 'Código de reserva requerido'
    if (!formData.precio) {
      newErrors.precio = 'Precio requerido'
    } else if (parseFloat(formData.precio) <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      await fetchAPI('/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          precio: parseFloat(formData.precio),
        }),
      })

      clearCache('/reservas')
      setMessage({ type: 'success', text: 'Reserva creada exitosamente' })
      setFormData({ id_pasajero: '', id_vuelo: '', codigo_reserva: '', estado: 'confirmada', precio: '' })
      setTimeout(() => setMessage(null), 4000)
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al crear la reserva. Intenta nuevamente.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Crear Reserva</h1>
        <p className="text-muted-foreground mt-1">Reserva un vuelo completando el formulario</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">ID Pasajero</label>
              <input
                type="number"
                name="id_pasajero"
                value={formData.id_pasajero}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 transition-colors ${
                  errors.id_pasajero
                    ? 'border-red-200 focus:ring-red-500/50'
                    : 'border-border focus:ring-primary/50'
                }`}
                placeholder="Ej: 1"
              />
              {errors.id_pasajero && <p className="text-xs text-red-600 mt-1">{errors.id_pasajero}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">ID Vuelo</label>
              <input
                type="number"
                name="id_vuelo"
                value={formData.id_vuelo}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 transition-colors ${
                  errors.id_vuelo
                    ? 'border-red-200 focus:ring-red-500/50'
                    : 'border-border focus:ring-primary/50'
                }`}
                placeholder="Ej: 5"
              />
              {errors.id_vuelo && <p className="text-xs text-red-600 mt-1">{errors.id_vuelo}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Código de Reserva</label>
              <input
                type="text"
                name="codigo_reserva"
                value={formData.codigo_reserva}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 transition-colors ${
                  errors.codigo_reserva
                    ? 'border-red-200 focus:ring-red-500/50'
                    : 'border-border focus:ring-primary/50'
                }`}
                placeholder="Ej: RES123ABC"
              />
              {errors.codigo_reserva && <p className="text-xs text-red-600 mt-1">{errors.codigo_reserva}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              >
                <option value="confirmada">Confirmada</option>
                <option value="pendiente">Pendiente</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Precio</label>
              <input
                type="number"
                step="0.01"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 transition-colors ${
                  errors.precio
                    ? 'border-red-200 focus:ring-red-500/50'
                    : 'border-border focus:ring-primary/50'
                }`}
                placeholder="Ej: 250.00"
              />
              {errors.precio && <p className="text-xs text-red-600 mt-1">{errors.precio}</p>}
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg text-sm font-medium flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creando...' : 'Crear Reserva'}
          </button>
        </form>
      </div>
    </div>
  )
}
