"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Users, Calendar, LogOut, BarChart3 } from "lucide-react"

interface Confirmation {
  id: string
  nombre: string
  email: string
  telefono: string
  asistentes: number
  mensaje: string | null
  created_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [confirmations, setConfirmations] = useState<Confirmation[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    totalGuests: 0,
  })

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

      // Calculate stats
      const totalGuests = data.confirmations.reduce((sum: number, conf: Confirmation) => sum + conf.asistentes, 0)
      setStats({
        total: data.confirmations.length,
        totalGuests,
      })
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-black">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-50 border-b border-gray-300 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-black" />
            <div>
              <h1 className="text-2xl font-serif text-black">Panel de Administración</h1>
              <p className="text-sm text-gray-600">Ana & Laris Wedding</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-black text-black hover:bg-gray-100 bg-transparent"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gray-50 border-gray-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Confirmaciones</p>
                <p className="text-3xl font-bold text-black">{stats.total}</p>
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
                <p className="text-3xl font-bold text-black">{stats.totalGuests}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-50 border-gray-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Días Restantes</p>
                <p className="text-3xl font-bold text-black">
                  {Math.floor((new Date("2026-06-15").getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Button className="bg-black hover:bg-gray-800 text-white" onClick={() => router.push("/admin/analytics")}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Ver Analíticas Detalladas
          </Button>
        </div>

        {/* Confirmations Table */}
        <Card className="p-6 bg-gray-50 border-gray-300">
          <h2 className="text-xl font-serif text-black mb-4">Lista de Confirmaciones</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-300">
                <tr>
                  <th className="text-left py-3 px-4 text-black font-semibold">Nombre</th>
                  <th className="text-left py-3 px-4 text-black font-semibold">Email</th>
                  <th className="text-left py-3 px-4 text-black font-semibold">Teléfono</th>
                  <th className="text-left py-3 px-4 text-black font-semibold">Asistentes</th>
                  <th className="text-left py-3 px-4 text-black font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {confirmations.map((conf) => (
                  <tr key={conf.id} className="border-b border-gray-200 hover:bg-white transition-colors">
                    <td className="py-3 px-4 text-black">{conf.nombre}</td>
                    <td className="py-3 px-4 text-gray-600">{conf.email}</td>
                    <td className="py-3 px-4 text-gray-600">{conf.telefono}</td>
                    <td className="py-3 px-4 text-black font-semibold">{conf.asistentes}</td>
                    <td className="py-3 px-4 text-gray-600">{new Date(conf.created_at).toLocaleDateString("es-MX")}</td>
                  </tr>
                ))}
                {confirmations.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-600">
                      No hay confirmaciones aún
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  )
}
