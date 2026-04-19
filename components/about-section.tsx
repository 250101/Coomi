"use client"

import { motion } from "framer-motion"
import { Code, Heart, Coffee, Utensils, Github, Linkedin, Mail } from "lucide-react"

export default function AboutSection() {
  return (
    <section className="py-24 relative overflow-hidden" id="about">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-12">
            <motion.h2
              className="text-4xl font-display relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Sobre el Proyecto
              <motion.span
                className="absolute -bottom-2 left-0 h-1 bg-primary"
                initial={{ width: 0 }}
                whileInView={{ width: "60px" }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
            </motion.h2>
            <div className="ml-6 h-px bg-border flex-grow" />
          </div>

          <div className="space-y-12">
            {/* Inspiración */}
            <div className="bg-card rounded-lg p-8 shadow-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Heart size={24} />
                </div>
                <h3 className="text-2xl font-display">¿Cómo nació la idea de Coomi?</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                La idea de Coomi surgió porque frecuentemente le cocinaba a mis amigos y a mi familia. En abril de 2025
                decidí irme a vivir a España, y quería dejar algo que les permitiera seguir haciendo mis recetas, o
                incluso crear las suyas propias y compartirlas entre ellos.
              </p>
              <p className="text-muted-foreground">
                A medida que fui desarrollando el proyecto, se me ocurrieron nuevas ideas: un foro para la comunidad,
                tips de cocina, una calculadora de ingredientes según el número de personas, y muchas otras funciones
                que todavía están por venir. Coomi fusiona mi interés por la gastronomía con mi curiosidad en
                desarrollo web.
              </p>
            </div>

            {/* Tecnologías */}
            <div className="bg-card rounded-lg p-8 shadow-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Code size={24} />
                </div>
                <h3 className="text-2xl font-display">Tecnologías Utilizadas</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-lg mb-2">Frontend</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    {[
                      "Next.js 16 (App Router)",
                      "React 19",
                      "TypeScript",
                      "Tailwind CSS",
                      "Framer Motion",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-2">Características</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    {[
                      "Modo oscuro/claro",
                      "Diseño responsivo",
                      "Animaciones fluidas",
                      "Búsqueda por ingredientes",
                      "Calculadora de porciones",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Reflexión */}
            <div className="bg-card rounded-lg p-8 shadow-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Coffee size={24} />
                </div>
                <h3 className="text-2xl font-display">Reflexión Personal</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Desarrollar Coomi ha sido un viaje que combina la programación y la cocina. Este proyecto representa
                la intersección perfecta entre mi constante aprendizaje de nuevas herramientas como desarrollador y mi
                amor por la gastronomía.
              </p>
              <p className="text-muted-foreground mb-4">
                Cada componente fue diseñado pensando en la experiencia del usuario, asegurando que las recetas sean
                fáciles de encontrar, entender y adaptar.
              </p>
              <p className="text-muted-foreground">
                Este proyecto es más que un simple recetario digital — es un testimonio de cómo la tecnología puede
                preservar tradiciones culinarias y facilitar su transmisión a nuevas generaciones.
              </p>
            </div>

            {/* Planes futuros */}
            <div className="bg-card rounded-lg p-8 shadow-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Utensils size={24} />
                </div>
                <h3 className="text-2xl font-display">Planes Futuros</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-background p-4 rounded-md">
                  <h4 className="font-medium text-lg mb-2">Funcionalidades</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    {[
                      "Más recetas",
                      "Sistema de autenticación",
                      "Guardado de favoritos",
                      "Lista de compras",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-background p-4 rounded-md">
                  <h4 className="font-medium text-lg mb-2">Contenido</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    {[
                      "Más categorías de recetas",
                      "Videos instructivos",
                      "Sección de técnicas culinarias",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Contacto */}
            <div className="bg-card rounded-lg p-8 shadow-md">
              <h3 className="text-2xl font-display mb-6">Conectemos</h3>
              <p className="text-muted-foreground mb-6">
                Si tenés sugerencias o simplemente querés compartir tu experiencia con Coomi, me encantaría saber de
                vos:
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://github.com/250101"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-background hover:bg-background-dark transition-colors px-4 py-2 rounded-md"
                >
                  <Github size={20} />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/mart%C3%ADn-moore-750b701b0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-background hover:bg-background-dark transition-colors px-4 py-2 rounded-md"
                >
                  <Linkedin size={20} />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="mailto:martinmoore@example.com"
                  className="flex items-center gap-2 bg-primary text-white hover:bg-primary/80 transition-colors px-4 py-2 rounded-md"
                >
                  <Mail size={20} />
                  <span>Contacto</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
