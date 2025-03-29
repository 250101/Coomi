"use client"

import { motion } from "framer-motion"
import { Code, Heart, Coffee, Utensils, Github, Linkedin } from "lucide-react"

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
            <div className="ml-6 h-px bg-border flex-grow"></div>
          </div>

          <div className="space-y-12">
            {/* Inspiration Section */}
            <div className="bg-card rounded-lg p-8 shadow-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Heart size={24} />
                </div>
                <h3 className="text-2xl font-display">Inspiración</h3>
              </div>

              <p className="text-muted-foreground mb-4">
                Coomi nació de la pasión por la cocina y la necesidad de organizar recetas familiares en un formato
                digital accesible. El nombre "Coomi" es una adaptación de "Cominegros" (¿Qué como, Negro?), un apodo
                cariñoso utilizado entre amigos al compartir recetas.
              </p>

              <p className="text-muted-foreground">
                Este proyecto fusiona mi interés por la gastronomía con mi experiencia en desarrollo web, creando una
                plataforma donde las recetas tradicionales y caseras pueden ser preservadas y compartidas con una
                interfaz moderna y atractiva.
              </p>
            </div>

            {/* Technologies Section */}
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
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>Next.js 14 (App Router)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>React 18</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>TypeScript</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>Tailwind CSS</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>Framer Motion</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-lg mb-2">Características</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>Modo oscuro/claro</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>Diseño responsivo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>Animaciones fluidas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>Búsqueda por ingredientes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>Calculadora de porciones</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Personal Reflection */}
            <div className="bg-card rounded-lg p-8 shadow-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Coffee size={24} />
                </div>
                <h3 className="text-2xl font-display">Reflexión Personal</h3>
              </div>

              <p className="text-muted-foreground mb-4">
                Desarrollar Coomi ha sido un viaje que combina dos de mis grandes pasiones: la programación y la cocina.
                Este proyecto representa la intersección perfecta entre mi vida profesional como desarrollador y mi amor
                por la gastronomía.
              </p>

              <p className="text-muted-foreground mb-4">
                Cada componente fue diseñado pensando en la experiencia del usuario, asegurando que las recetas sean
                fáciles de encontrar, entender y adaptar. Las animaciones sutiles y los efectos visuales buscan evocar
                la emoción y creatividad que siento al cocinar.
              </p>

              <p className="text-muted-foreground">
                Este proyecto es más que un simple recetario digital; es un testimonio de cómo la tecnología puede
                preservar tradiciones culinarias y facilitar su transmisión a nuevas generaciones, manteniendo viva la
                esencia de compartir comida con seres queridos.
              </p>
            </div>

            {/* Future Plans */}
            <div className="bg-card rounded-lg p-8 shadow-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Utensils size={24} />
                </div>
                <h3 className="text-2xl font-display">Planes Futuros</h3>
              </div>

              <p className="text-muted-foreground mb-6">
                Coomi continúa evolucionando con nuevas características planificadas:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-background p-4 rounded-md">
                  <h4 className="font-medium text-lg mb-2">Funcionalidades</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>Sistema de autenticación de usuarios</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>Guardado de recetas favoritas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>Creación de listas de compras</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-background p-4 rounded-md">
                  <h4 className="font-medium text-lg mb-2">Contenido</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>Expansión de categorías de recetas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>Videos instructivos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>Sección de técnicas culinarias</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Connect Section */}
            <div className="bg-card rounded-lg p-8 shadow-md">
              <h3 className="text-2xl font-display mb-6">Conectemos</h3>

              <p className="text-muted-foreground mb-6">
                Si estás interesado en colaborar, tienes sugerencias o simplemente quieres compartir tu experiencia con
                Coomi, me encantaría saber de ti:
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
                  href="mailto:your.email@example.com"
                  className="flex items-center gap-2 bg-primary text-white hover:bg-primary/80 transition-colors px-4 py-2 rounded-md"
                >
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

