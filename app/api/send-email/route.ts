import { NextResponse } from "next/server"

// Note: In production, you would use a real email service like Resend
// For now, this is a placeholder that simulates sending emails

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, subject, type, data } = body

    // In production, initialize with: new Resend(process.env.RESEND_API_KEY)
    // For demo purposes, we'll log the email
    console.log("[v0] Email would be sent:", { to, subject, type, data })

    if (type === "guest") {
      // Guest confirmation email
      const emailContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Georgia', serif; color: #000; background-color: #fff; padding: 40px 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #fafafa; padding: 40px; border: 1px solid #ddd; }
            h1 { font-size: 32px; text-align: center; margin-bottom: 10px; }
            .heart { text-align: center; font-size: 24px; margin: 20px 0; }
            p { line-height: 1.6; color: #333; }
            .details { background: #fff; padding: 20px; margin: 20px 0; border-left: 4px solid #000; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>¡Gracias por Confirmar!</h1>
            <div class="heart">♥</div>
            <p>Querido/a <strong>${data.nombre}</strong>,</p>
            <p>Estamos muy emocionados de que nos acompañes en nuestro día especial.</p>
            <div class="details">
              <p><strong>Detalles de tu confirmación:</strong></p>
              <p>Número de asistentes: ${data.asistentes}</p>
              <p><strong>Fecha:</strong> 15 de Junio, 2026</p>
              <p><strong>Hora Civil:</strong> 6:30 PM</p>
              <p><strong>Hora Fiesta:</strong> 7:00 PM</p>
              <p><strong>Lugar:</strong> La Querencia, Ciudad Obregón, Sonora</p>
            </div>
            <p>Recuerda que el código de vestimenta es Formal/Elegante.</p>
            <p>Esperamos verte pronto para celebrar juntos este momento tan especial.</p>
            <div class="footer">
              <p>Con amor,</p>
              <p><strong>Ana & Laris</strong></p>
              <p>♥</p>
            </div>
          </div>
        </body>
        </html>
      `

      // In production: await resend.emails.send({ from, to, subject, html: emailContent })
      // For demo, we simulate success
      return NextResponse.json({ success: true, message: "Email simulado enviado" })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Email error:", error)
    return NextResponse.json({ error: "Error al enviar email" }, { status: 500 })
  }
}
