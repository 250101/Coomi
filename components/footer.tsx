"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

export default function Footer() {
  // get translation function from language context
  const { t } = useLanguage()

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
          <motion.div whileHover={{ scale: 1.05 }}>
            {/* Logo con efecto neón azul */}
            <div className="logo-container logo-glow-effect">
              <Image
                src="/logo.png" // Tu logo en la carpeta public
                alt="Logo Coomi"
                width={200} // Ajusta el ancho según tu logo
                height={80} // Ajusta la altura según tu logo
                className="logo-image"
                priority // Para cargar la imagen rápidamente
              />
            </div>
          </motion.div>

          <motion.p className="text-muted-foreground text-center md:text-right">
            © {new Date().getFullYear()} {t("createdWith")}
          </motion.p>
        </motion.div>
      </div>

      {/* Abstract background effect */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent"></div>
      </div>
    </footer>
  )
}
