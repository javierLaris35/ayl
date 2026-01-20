"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, MapPin, Clock, Heart, Send, Mail, Church, Music, Utensils } from "lucide-react"
import { ImageCarousel } from "@/components/image-carousel"
import { ParallaxImage } from "@/components/parallax-image"

export default function WeddingPage() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [musicStarted, setMusicStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isVisible, setIsVisible] = useState(false)
  const [romanticQuoteVisible, setRomanticQuoteVisible] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asistentes: "1",
    mensaje: "",
  })
  const audioRef = useRef<HTMLAudioElement>(null)
  const quoteRef = useRef<HTMLDivElement>(null)

  const weddingDate = new Date("2026-02-14T18:00:00")

  const carouselImages = [
    { url: "/2.jpg", alt: "Ana & Laris" },
    { url: "/3.jpg", alt: "Ana & Laris" },
    { url: "/4.jpg", alt: "Ana & Laris" },
    { url: "/5.jpg", alt: "Ana & Laris" },
    { url: "/6.jpg", alt: "Ana & Laris" },
    { url: "/7.jpg", alt: "Ana & Laris" },
    { url: "/8.jpg", alt: "Ana & Laris" },
    { url: "/9.jpeg", alt: "Ana & Laris" },
  ]

  useEffect(() => {
    if (musicStarted && audioRef.current) {
      // Descomentar para que funcione la música
      audioRef.current.play().catch(() => {})
    }

    setIsVisible(true)

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = weddingDate.getTime() - now

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }, 1000)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRomanticQuoteVisible(true)
          }
        })
      },
      { threshold: 0.5 },
    )

    if (quoteRef.current) {
      observer.observe(quoteRef.current)
    }

    return () => {
      clearInterval(timer)
      if (quoteRef.current) {
        observer.unobserve(quoteRef.current)
      }
    }
  }, [musicStarted])

  const handleWhatsAppConfirm = () => {
    const message = `Hola! Confirmo mi asistencia a la boda de Ana & Laris.\nNombre: ${formData.nombre}\nEmail: ${formData.email}\nTeléfono: ${formData.telefono}\nAsistentes: ${formData.asistentes}\nMensaje: ${formData.mensaje}`
    window.open(`https://wa.me/526444230374?text=${encodeURIComponent(message)}`, "_blank")
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("¡Gracias por confirmar! Te hemos enviado un correo de confirmación.")
        setFormData({ nombre: "", email: "", telefono: "", asistentes: "1", mensaje: "" })
      }
    } catch (error) {
      console.error("Error al confirmar:", error)
      handleWhatsAppConfirm()
    }
  }

  const handleEnter = () => {
    setMusicStarted(true)
    setShowWelcome(false)
  }

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full animate-pulse" />
          <div
            className="absolute bottom-10 right-10 w-48 h-48 border border-white rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/3 right-1/4 w-24 h-24 border border-white rounded-full animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute bottom-1/3 left-1/4 w-40 h-40 border border-white rounded-full animate-pulse"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="mb-8">
              <Heart className="w-24 h-24 mx-auto text-white animate-pulse" />
            </div>

            <p className="text-sm tracking-[0.5em] uppercase text-gray-400 mb-4 font-light">Save the Date</p>

            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-4 text-white text-balance leading-tight">
              Invitación a Nuestra Boda
            </h1>

            <div className="h-px w-32 bg-gradient-to-r from-transparent via-white to-transparent mx-auto my-8" />

            <p className="text-2xl md:text-4xl font-serif mb-4 text-white italic">¡Qué emoción tenerte aquí!</p>

            <p className="text-gray-400 mb-12 text-lg">
              Queremos compartir contigo el día más especial de nuestras vidas
            </p>

            <div className="flex items-center justify-center gap-6 mb-16">
              <h1 className="font-serif text-4xl md:text-6xl lg:text-8xl mb-8 text-white text-balance">
                Ana <span className="text-gray-600">&</span> Laris
              </h1>
            </div>

            <Button
              size="lg"
              onClick={handleEnter}
              className="bg-white hover:bg-gray-100 text-black px-16 py-7 text-xl font-serif rounded-full shadow-2xl transform hover:scale-105 transition-all"
            >
              Entrar
            </Button>

            <p className="text-gray-500 text-sm mt-8">14 de Febrero, 2026 • Ciudad Obregón, Sonora</p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-30" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <audio ref={audioRef} loop>
        <source src="/audio/a&l.mp3" type="audio/mp4" />
      </audio>

      {/* Parallax Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <ParallaxImage
            src="/elegant-wedding-venue-black-and-white.jpg"
            alt="Wedding background"
            speed={0.3}
            className="h-full opacity-40"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white z-0" />

        <div
          className={`relative z-10 text-center px-4 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-block mb-6">
            <Heart className="w-16 h-16 text-black animate-pulse" />
          </div>
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-600 mb-4">Save The Date</p>
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl mb-8 text-black text-balance">
            Ana <span className="text-gray-600">&</span> Laris
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-12">14 de Febrero, 2026</p>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-black rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Romantic Quote Section */}
      <section ref={quoteRef} className="py-20 px-4 bg-black">
        <div
          className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${
            romanticQuoteVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Heart className="w-12 h-12 mx-auto mb-6 text-white" />
          <blockquote className="text-2xl md:text-3xl font-serif italic text-white mb-4">
            "El amor no es mirarse el uno al otro, sino mirar juntos en la misma dirección"
          </blockquote>
          <p className="text-white">- Antoine de Saint-Exupéry</p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-16 text-black">Nuestra Historia</h2>
          <ImageCarousel images={carouselImages} />
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-16 text-white">Está apunto de llegar nuestro gran día.</h2>
          <h2 className="text-2xl md:text-3xl font-serif text-center mb-16 text-white">Faltan...</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { value: timeLeft.days, label: "Días" },
              { value: timeLeft.hours, label: "Horas" },
              { value: timeLeft.minutes, label: "Minutos" },
              { value: timeLeft.seconds, label: "Segundos" },
            ].map((item, index) => (
              <Card
                key={item.label}
                className="p-4 text-center bg-black transition-all duration-300 border-none"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`,
                }}
              >
                <div className="text-6xl md:text-8xl font-serif text-white mb-2">
                  {String(item.value).padStart(2, "0")}
                </div>
                <div className="text-sm md:text-base uppercase tracking-wider text-gray-100">{item.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Wedding Day Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-16 text-black">Nuestro Día Especial</h2>
          
          {/* Imagen agregada */}
          <div className="flex justify-center mb-12">
            <div className="relative w-full max-w-3xl"> {/* Aumenté el max-w a 3xl */}
              {/* Gradiente de gris oscuro a negro */}
              <div className="absolute -inset-4 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-2xl transform rotate-2"></div>
              
              <div className="relative rounded-xl overflow-hidden border-8 border-white shadow-2xl">
                {/* Contenedor de imagen con object-contain para verla completa */}
                <div className="w-full h-72 md:h-96 bg-gray-900 flex items-center justify-center">
                  <img 
                    src="/anaylaris.png" 
                    alt="Nuestro día especial" 
                    className="max-w-full max-h-full object-contain p-2"
                  />
                </div>
              </div>
              
              {/* Elemento decorativo opcional */}
              <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white/80" />
              </div>
              <div className="absolute -bottom-3 -left-3 w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white/80" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 bg-white border-gray-300 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-serif text-center mb-4 text-black">Ceremonia</h3>
              <div className="space-y-4 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>6:15 PM</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>La Querencia</span>
                </div>
                <p className="text-sm text-gray-600">Ciudad Obregón, Sonora</p>
              </div>
            </Card>

            <Card className="p-8 bg-white border-gray-300 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-serif text-center mb-4 text-black">Recepción</h3>
              <div className="space-y-4 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>7:00 PM</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>La Querencia</span>
                </div>
                <p className="text-sm text-gray-600">Ciudad Obregón, Sonora</p>
              </div>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-black hover:bg-gray-800 text-white"
              onClick={() => window.open("https://maps.google.com/?q=La+Querencia+Ciudad+Obregon", "_blank")}
            >
              <MapPin className="mr-2 h-5 w-5" />
              Ver Ubicación en Maps
            </Button>
          </div>
        </div>
      </section>

      {/* No childs section */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-8 text-white">¡Exclusivo Adultos!</h2>
          <Heart className="w-10 h-10 mx-auto mb-4 text-white" />
          <p className="text-lg text-white mb-2">Aunque amamos a los pequeños de la familia</p>
          <p className="text-white">
            Hemos decidido que nuestra boda sea una celebración exclusiva para adultos. Esperamos contar con tu
            comprensión y disfrutar juntos de esta noche especial.
          </p>
        </div>
      </section>

      {/* Dress Code Section */}      
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-8 text-black">Código de Vestimenta</h2>
          <h2 className="text-2xl md:text-3xl font-serif mb-8 text-black">Formal</h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">Exclusivo Negro</p>

          <div className="flex justify-center mb-8">
            <img
              src="/images/gth-e1733768272464-860x1024.png"
              alt="Dress code - Formal attire"
              className="max-w-xs w-full h-auto"
            />
          </div>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Te pedimos que nos acompañes con tu mejor atuendo negro para celebrar este momento tan especial
          </p>
        </div>
      </section>

      {/* Gift Suggestions Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-8 text-white">Sugerencia de Regalo</h2>
          <div className="mb-8">
            <Mail className="w-16 h-16 mx-auto text-white mb-4" />
          </div>
          <p className="text-xl text-white mb-4">Lluvia de Sobres</p>
          <p className="text-white max-w-xl mx-auto">
            Tu presencia es nuestro mejor regalo, pero si deseas tener un detalle con nosotros, agradeceremos tu
            aportación en efectivo.
          </p>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-8 text-black">Confirma tu Asistencia</h2>
          <p className="text-center text-gray-600 mb-12">Tu presencia es muy importante para nosotros</p>

          <Card className="p-8 bg-white border-gray-300">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium mb-2 text-black">
                  Nombre Completo
                </label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  className="bg-gray-50 border-gray-300"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-black">
                  Correo Electrónico (Opcional)
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-gray-50 border-gray-300"
                />
              </div>

              <div>
                <label htmlFor="telefono" className="block text-sm font-medium mb-2 text-black">
                  Teléfono
                </label>
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="Tu teléfono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  required
                  className="bg-gray-50 border-gray-300"
                />
              </div>

              <div>
                <label htmlFor="asistentes" className="block text-sm font-medium mb-2 text-black">
                  Número de Asistentes
                </label>
                <Input
                  id="asistentes"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={formData.asistentes}
                  onChange={(e) => setFormData({ ...formData, asistentes: e.target.value })}
                  required
                  className="bg-gray-50 border-gray-300"
                />
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-sm font-medium mb-2 text-black">
                  Mensaje (Opcional)
                </label>
                <Textarea
                  id="mensaje"
                  placeholder="Déjanos un mensaje..."
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  className="bg-gray-50 border-gray-300"
                  rows={4}
                />
              </div>

              <Button type="submit" size="lg" className="w-full bg-black hover:bg-gray-800 text-white">
                <Send className="mr-2 h-5 w-5" />
                Confirmar Asistencia
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full border-black text-black hover:bg-gray-100 bg-transparent"
                onClick={handleWhatsAppConfirm}
              >
                <Send className="mr-2 h-5 w-5" />
                Confirmar por WhatsApp
              </Button>
            </form>
          </Card>
        </div>
      </section>

      <footer className="py-12 px-4 text-center border-t border-b bg-black">
        <div className="space-y-4">
          <h3 className="text-3xl font-serif text-white">Ana & Laris</h3>
          <p className="text-gray-400">14 de Febrero, 2026</p>
          <div className="flex items-center justify-center gap-2">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
        </div>
      </footer>
    </div>
  )
}
