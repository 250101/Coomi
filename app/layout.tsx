import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Playfair_Display, Barlow_Condensed } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"

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

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["300", "700"],
  variable: "--font-barlow",
  display: "swap",
})

// Bebas Neue no está en Google Fonts — se carga como fuente local
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${playfair.variable} ${bebas.variable} ${barlow.variable} font-montserrat`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
