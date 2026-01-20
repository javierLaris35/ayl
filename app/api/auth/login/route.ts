import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 })
    }

    const supabase = await getSupabaseServerClient()

    // Get admin user from database
    const { data: adminUser, error } = await supabase.from("admin_users").select("*").eq("email", email).single()

    if (error || !adminUser) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, adminUser.password_hash)

    if (!validPassword) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Create session using Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: "admin123", // This will need to be updated to use proper Supabase auth
    })

    if (authError) {
      // Fallback: Set a simple session cookie
      const cookieStore = await cookies()
      cookieStore.set("admin-session", adminUser.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
      })
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: adminUser.id,
          email: adminUser.email,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 })
  }
}
