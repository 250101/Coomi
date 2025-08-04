"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import Logo from "@/components/logo"

export default function Footer() {
  // Get translation function from language context
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
            <Logo />
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
