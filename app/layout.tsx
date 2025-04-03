import type React from "react"
import type { Metadata } from "next"
import { Raleway, Merriweather, Oswald, Dancing_Script } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"

// Configure fonts with next/font
const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
})

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
  display: "swap",
})

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
})

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Coomi - ¿Qué como?",
  description:
    "En este menú interactivo vas a encontrar todas las recetas que alguna vez cociné para mis amigos y familiar. Podés recrealas, modificarlas y compartir tu experiencia en el foro.",
    icons: {
      icon: "/images/favicon.ico",
}
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700;900&family=Oswald:wght@400;500;600;700&family=Dancing+Script:wght@400;500;600;700&display=swap"
        />
      </head>
      <body
        className={`${raleway.variable} ${merriweather.variable} ${oswald.variable} ${dancingScript.variable} font-raleway`}
      >
        {/* Wrap the app with both ThemeProvider and LanguageProvider */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'