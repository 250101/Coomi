import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import AboutSection from "@/components/about-section"

export const metadata = {
  title: "Sobre el Proyecto - Coomi",
  description: "Conoce la historia detrás de Coomi y las tecnologías utilizadas para crear esta plataforma de recetas.",
}

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background to-background-dark">
      <div className="cosmic-background"></div>
      <Navbar />
      <div className="py-24 relative z-10">
        <AboutSection />
      </div>
      <Footer />
    </main>
  )
}
