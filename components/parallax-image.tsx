"use client"

import { useEffect, useRef, useState } from "react"

interface ParallaxImageProps {
  src: string
  alt: string
  speed?: number
  className?: string
}

export function ParallaxImage({ src, alt, speed = 0.5, className = "" }: ParallaxImageProps) {
  const imageRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!imageRef.current) return

      const rect = imageRef.current.getBoundingClientRect()
      const scrolled = window.pageYOffset
      const rate = scrolled * speed

      // Only apply parallax when element is in viewport
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setOffset(rate)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return (
    <div ref={imageRef} className={`overflow-hidden ${className}`}>
      <div
        className="parallax w-full h-full"
        style={{
          transform: `translateY(${offset}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <img src={src || "/placeholder.svg"} alt={alt} className="w-full h-full object-cover" />
      </div>
    </div>
  )
}
