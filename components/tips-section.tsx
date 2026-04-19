"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { ChevronDown } from "lucide-react"

const tips = [
  {
    title: "Freír Correctamente",
    content:
      "Siempre freí en abundante aceite. Contrario a lo que se cree, si el aceite es poco, el producto absorbe mucho más y se cocina disparejamente. Con aceite abundante, el producto queda más crujiente y menos grasoso.",
  },
  {
    title: "Escurrir sin Perder Crocancia",
    content:
      "Al freír, cuando sacamos el producto ya dorado, solemos ponerlo en un plato con papel absorbente para sacarle el exceso de aceite, pero esto termina quitándole propiedades como lo crujiente. Te recomiendo usar una fuente para horno con rejilla, y colocar el producto ahí. No perderá ninguna propiedad y el exceso de aceite se escurrirá. Este es el momento justo para ponerle ralladura de limón y una pizca de sal.",
  },
  {
    title: "Risotto Creativo",
    content:
      "Cuando hacés risotto, recordá que podés abrir tu imaginación. La receta que te paso yo es de curry, pero podés hacer miles de formas. Lo importante es que juegues. Por ejemplo, se puede hacer un risotto clásico, y al final ponerle la crema de champiñones o la crema de boniato.",
  },
  {
    title: "Caramelizar Cebollas",
    content:
      "Para caramelizar cebollas correctamente, cortarlas en pluma y cocinarlas a fuego muy bajo con un poco de manteca y sal. La paciencia es clave: toma entre 30-40 minutos, pero el resultado vale la pena. Revolvé ocasionalmente y no subas el fuego para acelerar el proceso, ya que se quemarían en vez de caramelizarse.",
  },
  {
    title: "Salsas Versátiles",
    content:
      "Las salsas y cremas que te enseño pueden usarse de múltiples formas. La crema de boniato puede ser base para un plato, dip para vegetales o aderezo para carnes. Experimentá combinando diferentes salsas con distintos platos para descubrir nuevos sabores.",
  },
  {
    title: "Preparación Anticipada",
    content:
      "Muchas de estas recetas tienen componentes que pueden prepararse con anticipación. Las salsas, cremas y rellenos suelen mejorar su sabor después de un día en la heladera, lo que te permite distribuir el trabajo de cocina y reducir el estrés al momento de servir.",
  },
]

export default function TipsSection() {
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  return (
    <section className="py-32 relative" id="tips">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase block mb-6">
            Cocina
          </span>
          <h2 className="text-5xl md:text-6xl font-display leading-none">
            {t("cookingTips")}
          </h2>
        </motion.div>

        {/* Acordeón de tips */}
        <div className="space-y-0 divide-y divide-border">
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
            >
              <button
                className="w-full flex items-center justify-between py-7 text-left group"
                onClick={() => toggle(index)}
              >
                <div className="flex items-center gap-6">
                  <span className="text-xs text-muted-foreground w-5 text-right flex-shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={`text-lg font-display transition-colors ${
                    openIndex === index ? "text-primary" : "text-foreground group-hover:text-primary"
                  }`}>
                    {tip.title}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex-shrink-0 ml-4"
                >
                  <ChevronDown
                    size={18}
                    className={`transition-colors ${
                      openIndex === index ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-8 pl-11 text-muted-foreground leading-relaxed">
                      {tip.content}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
