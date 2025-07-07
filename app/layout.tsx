import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Playfair_Display } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"

// Configure fonts with next/font
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

// Load fonts that aren't available in Google Fonts as local fonts
const bebas = localFont({
  src: "../public/fonts/BebasNeue-Regular.woff2",
  variable: "--font-bebas",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Coomi - ¿Qué como?",
  description: `En este menú interactivo vas a encontrar todas las recetas que alguna vez cociné para mis amigos y familiares. Podés recrearlas, modificarlas y compartir tu experiencia en el foro.
Incluye un buscador por ingredientes para cuando tengas algo en la heladera y no sepas qué hacer.
También tenés una calculadora que ajusta las cantidades según cuántas personas comen.
Hay una sección de recetas vegetarianas, tips de cocina que te van a salvar, y muy pronto, recetas sin TACC.`,
  generator: "v0.dev"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${playfair.variable} ${bebas.variable} ${satisfy.variable} font-montserrat`}
      >
        {/* Wrap the app with both ThemeProvider and LanguageProvider */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import "./globals.css"

import "./globals.css"



import './globals.css'