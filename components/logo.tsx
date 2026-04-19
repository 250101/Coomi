"use client"

import type React from "react"

interface LogoProps {
  className?: string
  size?: "small" | "medium" | "large"
  showReflection?: boolean
}

export default function Logo({
  className = "",
  size = "medium",
  showReflection = true,
}: LogoProps) {

  const cfg = {
    small: {
      fontSize:     "1.5rem",
      circleR:      13,
      circleOffset: 22,
      svgW:         68,
      svgH:         28,
      lineH:        "1.5px",
      letterSpacing:"0.12em",
    },
    medium: {
      fontSize:     "2.6rem",
      circleR:      22,
      circleOffset: 38,
      svgW:         116,
      svgH:         48,
      lineH:        "2px",
      letterSpacing:"0.12em",
    },
    large: {
      fontSize:     "6rem",
      circleR:      52,
      circleOffset: 88,
      svgW:         272,
      svgH:         110,
      lineH:        "3px",
      letterSpacing:"0.12em",
    },
  }

  const s = cfg[size]

  const baseFont: React.CSSProperties = {
    fontFamily: "'Barlow Condensed', var(--font-montserrat), sans-serif",
    fontWeight: 700,
    fontSize: s.fontSize,
    lineHeight: 1,
    letterSpacing: s.letterSpacing,
    display: "flex",
    alignItems: "baseline",
  }

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-start",
        userSelect: "none",
      }}
    >
      {/* ── COOMI ── */}
      <div style={baseFont}>
        <span style={{ color: "var(--foreground, #ffffff)" }}>C</span>

        {/* OO con círculos superpuestos */}
        <span style={{ position: "relative", color: "hsl(var(--primary))" }}>
          OO
          <svg
            aria-hidden="true"
            width={s.svgW}
            height={s.svgH}
            viewBox={`0 0 ${s.svgW} ${s.svgH}`}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              overflow: "visible",
            }}
          >
            {/* Círculo izquierdo — naranja */}
            <circle
              cx={s.svgW / 2 - s.circleOffset * 0.28}
              cy={s.svgH / 2}
              r={s.circleR}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="1.8"
              opacity="0.8"
            />
            {/* Círculo derecho — blanco */}
            <circle
              cx={s.svgW / 2 + s.circleOffset * 0.28}
              cy={s.svgH / 2}
              r={s.circleR}
              fill="none"
              stroke="white"
              strokeWidth="1.8"
              opacity="0.3"
            />
          </svg>
        </span>

        <span style={{ color: "var(--foreground, #ffffff)" }}>MI</span>
      </div>

      {/* ── Línea divisoria ── */}
      <div
        style={{
          width: "100%",
          height: s.lineH,
          background: "#2a2a2a",
          marginTop: "3px",
        }}
      />

      {/* ── MOORE reflejo desvaneciéndose ── */}
      {showReflection && (
        <div
          style={{
            ...baseFont,
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.08) 60%, rgba(255,255,255,0) 100%)",
            maskImage:
              "linear-gradient(to bottom, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.08) 60%, rgba(255,255,255,0) 100%)",
            pointerEvents: "none",
            marginTop: "2px",
            overflow: "hidden",
            // Mostrar solo ~70% de la altura para que se corte con el fade
            maxHeight: `calc(${s.fontSize} * 0.72)`,
          }}
        >
          <span style={{ color: "var(--foreground, #ffffff)" }}>M</span>
          <span style={{ color: "hsl(var(--primary))" }}>OO</span>
          <span style={{ color: "var(--foreground, #ffffff)" }}>RE</span>
        </div>
      )}
    </div>
  )
}
