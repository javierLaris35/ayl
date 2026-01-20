"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, ArrowLeft, Users, TrendingUp, Mail } from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface Confirmation {
  id: string
  nombre: string
  email: string
  telefono: string
  asistentes: number
  mensaje: string | null
  created_at: string
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [confirmations, setConfirmations] = useState<Confirmation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConfirmations()
  }, [])

  const fetchConfirmations = async () => {
    try {
      const response = await fetch("/api/admin/confirmations")
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login")
          return
        }
        throw new Error("Error fetching confirmations")
      }

      const data = await response.json()
      setConfirmations(data.confirmations)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const totalConfirmations = confirmations.length
  const totalGuests = confirmations.reduce((sum, conf) => sum + conf.asistentes, 0)
  const avgGuestsPerConfirmation = totalConfirmations > 0 ? (totalGuests / totalConfirmations).toFixed(1) : 0
  const withMessages = confirmations.filter((c) => c.mensaje && c.mensaje.trim().length > 0).length

  // Confirmations over time (by day)
  const confirmationsByDate = confirmations.reduce((acc: { [key: string]: number }, conf) => {
    const date = new Date(conf.created_at).toLocaleDateString("es-MX")
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  const timelineData = Object.entries(confirmationsByDate)
    .map(([date, count]) => ({ date, confirmaciones: count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Guests distribution
  const guestsDistribution = confirmations.reduce((acc: { [key: number]: number }, conf) => {
    acc[conf.asistentes] = (acc[conf.asistentes] || 0) + 1
    return acc
  }, {})

  const guestsData = Object.entries(guestsDistribution)
    .map(([guests, count]) => ({
      asistentes: `${guests} ${Number(guests) === 1 ? "persona" : "personas"}`,
      cantidad: count,
    }))
    .sort((a, b) => Number.parseInt(a.asistentes) - Number.parseInt(b.asistentes))

  // Cumulative guests over time
  const cumulativeData = timelineData.reduce((acc: any[], item, index) => {
    const confsOnDate = confirmations.filter((c) => new Date(c.created_at).toLocaleDateString("es-MX") === item.date)
    const guestsOnDate = confsOnDate.reduce((sum, conf) => sum + conf.asistentes, 0)

    const previousTotal = index > 0 ? acc[index - 1].total : 0
    acc.push({
      date: item.date,
      total: previousTotal + guestsOnDate,
    })
    return acc
  }, [])

  // Response rate data (example)
  const responseData = [
    { name: "Confirmados", value: totalGuests, color: "#000000" },
    { name: "Pendientes", value: Math.max(0, 150 - totalGuests), color: "#d1d5db" }, // Assuming 150 invited
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-black">Cargando analíticas...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-50 border-b border-gray-300 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/admin")}
              className="border-black text-black hover:bg-gray-100 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-black" />
              <div>
                <h1 className="text-2xl font-serif text-black">Analíticas</h1>
                <p className="text-sm text-gray-600">Ana & Laris Wedding</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gray-50 border-gray-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Confirmaciones</p>
                <p className="text-3xl font-bold text-black">{totalConfirmations}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-50 border-gray-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Invitados</p>
                <p className="text-3xl font-bold text-black">{totalGuests}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-50 border-gray-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Promedio por Confirmación</p>
                <p className="text-3xl font-bold text-black">{avgGuestsPerConfirmation}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-50 border-gray-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Con Mensaje</p>
                <p className="text-3xl font-bold text-black">{withMessages}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Confirmations Timeline */}
          <Card className="p-6 bg-gray-50 border-gray-300">
            <h2 className="text-xl font-serif text-black mb-4">Confirmaciones por Día</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 12 }} />
                <YAxis tick={{ fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #d1d5db" }}
                  labelStyle={{ color: "#000" }}
                />
                <Bar dataKey="confirmaciones" fill="#000000" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Cumulative Guests */}
          <Card className="p-6 bg-gray-50 border-gray-300">
            <h2 className="text-xl font-serif text-black mb-4">Invitados Acumulados</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cumulativeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 12 }} />
                <YAxis tick={{ fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #d1d5db" }}
                  labelStyle={{ color: "#000" }}
                />
                <Line type="monotone" dataKey="total" stroke="#000000" strokeWidth={2} dot={{ fill: "#000" }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Guests Distribution */}
          <Card className="p-6 bg-gray-50 border-gray-300">
            <h2 className="text-xl font-serif text-black mb-4">Distribución de Asistentes</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={guestsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis dataKey="asistentes" tick={{ fill: "#6b7280", fontSize: 12 }} />
                <YAxis tick={{ fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #d1d5db" }}
                  labelStyle={{ color: "#000" }}
                />
                <Bar dataKey="cantidad" fill="#000000" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Response Rate */}
          <Card className="p-6 bg-gray-50 border-gray-300">
            <h2 className="text-xl font-serif text-black mb-4">Tasa de Respuesta</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={responseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {responseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #d1d5db" }}
                  labelStyle={{ color: "#000" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center text-sm text-gray-600 mt-4">Basado en 150 invitaciones enviadas</p>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6 bg-gray-50 border-gray-300">
          <h2 className="text-xl font-serif text-black mb-4">Actividad Reciente</h2>
          <div className="space-y-4">
            {confirmations.slice(0, 5).map((conf) => (
              <div
                key={conf.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="font-semibold text-black">{conf.nombre}</p>
                    <p className="text-sm text-gray-600">{conf.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-black">
                    {conf.asistentes} {conf.asistentes === 1 ? "persona" : "personas"}
                  </p>
                  <p className="text-sm text-gray-600">{new Date(conf.created_at).toLocaleDateString("es-MX")}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  )
}
