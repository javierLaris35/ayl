import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, email, telefono, asistentes, mensaje } = body

    // Validate required fields
    if (!nombre || !email || !telefono || !asistentes) {
      return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 })
    }

    const supabase = await getSupabaseServerClient()

    // Insert confirmation into database
    const { data, error } = await supabase
      .from("confirmations")
      .insert([
        {
          nombre,
          email,
          telefono,
          asistentes: Number.parseInt(asistentes),
          mensaje: mensaje || null,
        },
      ])
      .select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Error al guardar confirmación" }, { status: 500 })
    }

    // Send confirmation email to guest
    try {
      await fetch(`${request.headers.get("origin")}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          subject: "Confirmación de Asistencia - Boda Ana & Laris",
          type: "guest",
          data: { nombre, asistentes },
        }),
      })
    } catch (emailError) {
      console.error("Email error:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 })
  }
}
