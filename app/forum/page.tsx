import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ForumSection from "@/components/forum-section"

export const metadata = {
  title: "Foro - Coomi",
  description: "Comparte tus consejos, variaciones o preguntas sobre las recetas de Coomi.",
}

export default function ForumPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background to-background-dark">
      <div className="cosmic-background"></div>
      <Navbar />
      <div className="py-24 relative z-10">
        <ForumSection />
      </div>
      <Footer />
    </main>
  )
}
