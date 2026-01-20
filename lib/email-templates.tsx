interface GuestEmailProps {
  nombre: string
  asistentes: number
}

export function GuestConfirmationEmail({ nombre, asistentes }: GuestEmailProps) {
  return (
    <div style={{ fontFamily: "Georgia, serif", color: "#000", backgroundColor: "#fff", padding: "40px 20px" }}>
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "#fafafa",
          padding: "40px",
          border: "1px solid #ddd",
        }}
      >
        <h1 style={{ fontSize: "32px", textAlign: "center", marginBottom: "10px" }}>¡Gracias por Confirmar!</h1>
        <div style={{ textAlign: "center", fontSize: "24px", margin: "20px 0" }}>♥</div>
        <p style={{ lineHeight: "1.6", color: "#333" }}>
          Querido/a <strong>{nombre}</strong>,
        </p>
        <p style={{ lineHeight: "1.6", color: "#333" }}>
          Estamos muy emocionados de que nos acompañes en nuestro día especial.
        </p>
        <div style={{ background: "#fff", padding: "20px", margin: "20px 0", borderLeft: "4px solid #000" }}>
          <p style={{ lineHeight: "1.6", color: "#333" }}>
            <strong>Detalles de tu confirmación:</strong>
          </p>
          <p style={{ lineHeight: "1.6", color: "#333" }}>Número de asistentes: {asistentes}</p>
          <p style={{ lineHeight: "1.6", color: "#333" }}>
            <strong>Fecha:</strong> 15 de Junio, 2026
          </p>
          <p style={{ lineHeight: "1.6", color: "#333" }}>
            <strong>Hora Civil:</strong> 6:30 PM
          </p>
          <p style={{ lineHeight: "1.6", color: "#333" }}>
            <strong>Hora Fiesta:</strong> 7:00 PM
          </p>
          <p style={{ lineHeight: "1.6", color: "#333" }}>
            <strong>Lugar:</strong> La Querencia, Ciudad Obregón, Sonora
          </p>
        </div>
        <p style={{ lineHeight: "1.6", color: "#333" }}>Recuerda que el código de vestimenta es Formal/Elegante.</p>
        <p style={{ lineHeight: "1.6", color: "#333" }}>
          Esperamos verte pronto para celebrar juntos este momento tan especial.
        </p>
        <div style={{ textAlign: "center", marginTop: "30px", color: "#666", fontSize: "14px" }}>
          <p>Con amor,</p>
          <p>
            <strong>Ana & Laris</strong>
          </p>
          <p>♥</p>
        </div>
      </div>
    </div>
  )
}
