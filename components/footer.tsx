"use client"

import { motion } from "framer-motion"

export default function Footer() {
  return (
    <footer className="bg-background-dark py-16 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.div className="text-4xl font-artistic text-primary" whileHover={{ scale: 1.05 }}>
            Cominegros
          </motion.div>

          <motion.p className="text-muted-foreground text-center md:text-right">
            © {new Date().getFullYear()} Cominegros. Creado con ❤️ por Martín Moore.
          </motion.p>
        </motion.div>
      </div>

      {/* Efecto de fondo abstracto */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent"></div>
      </div>
    </footer>
  )
}

