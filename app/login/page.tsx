"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Heart, Lock } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/admin")
      } else {
        setError(data.error || "Error al iniciar sesión")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 bg-gray-50 border-gray-300">
        <div className="text-center mb-8">
          <Heart className="w-12 h-12 mx-auto mb-4 text-black" />
          <h1 className="text-3xl font-serif text-black mb-2">Admin Panel</h1>
          <p className="text-gray-600">Ana & Laris Wedding</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-black">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="admin@anaylaris.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="bg-white border-gray-300"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2 text-black">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="bg-white border-gray-300"
            />
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}

          <Button type="submit" disabled={loading} className="w-full bg-black hover:bg-gray-800 text-white">
            <Lock className="mr-2 h-4 w-4" />
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Credenciales por defecto:</p>
          <p className="font-mono text-xs mt-2">admin@anaylaris.com / admin123</p>
        </div>
      </Card>
    </div>
  )
}
