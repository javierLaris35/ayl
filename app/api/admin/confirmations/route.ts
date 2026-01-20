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

    // Fetch all confirmations
    const { data: confirmations, error } = await supabase
      .from("confirmations")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Error al obtener confirmaciones" }, { status: 500 })
    }

    return NextResponse.json({ confirmations }, { status: 200 })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 })
  }
}
