import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Check admin session
    const cookieStore = await cookies()
    const session = cookieStore.get("admin-session")

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const supabase = await getSupabaseServerClient()

    // Fetch all confirmations with detailed stats
    const { data: confirmations, error } = await supabase
      .from("confirmations")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Error al obtener confirmaciones" }, { status: 500 })
    }

    // Calculate analytics
    const totalConfirmations = confirmations.length
    const totalGuests = confirmations.reduce((sum: number, conf: any) => sum + conf.asistentes, 0)
    const avgGuests = totalConfirmations > 0 ? totalGuests / totalConfirmations : 0

    // Group by date
    const byDate = confirmations.reduce((acc: { [key: string]: number }, conf: any) => {
      const date = new Date(conf.created_at).toISOString().split("T")[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

    return NextResponse.json({
      confirmations,
      stats: {
        totalConfirmations,
        totalGuests,
        avgGuests: avgGuests.toFixed(2),
        byDate,
      },
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 })
  }
}
