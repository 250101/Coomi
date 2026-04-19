"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { Leaf } from "lucide-react"

const steps = [
  "Pelar una berenjena sin sacarle el tallo.",
  "Untar la berenjena con aceite de oliva, pimienta y un poco de sal.",
  "Envolverla en aluminio y dejarla en el horno a fuego fuerte por 15-20 minutos.",
  "Una vez que la sacás, la berenjena tiene que estar blanda como para aplastarla de a poquito, pero no se tiene que deshacer.",
  "Cuando la tengas de un ancho considerado para una milanesa (1-1.5 cm), pasala por harina, después por huevo y finalmente por panko.",
  "Freíla en aceite abundante y caliente, sacala cuando esté dorada, y rallale limón apenas sale.",
]

export default function VegetarianSection() {
  const { t } = useLanguage()

  return (
    <section className="py-32 relative" id="vegetarian">
      {/* Línea decorativa izquierda */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Leaf size={16} className="text-primary" />
            </div>
            <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Sin carne
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-display text-primary leading-none mb-8">
            {t("vegetarianTitle")}
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
            {t("vegetarianDescription")}
          </p>
        </motion.div>

        {/* Receta */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <h3 className="text-2xl font-display mb-12 text-foreground">
            {t("eggplantKatsu")}
          </h3>

          {/* Steps */}
          <ol className="space-y-0">
            {steps.map((step, index) => (
              <motion.li
                key={index}
                className="flex gap-6 pb-10 relative"
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                {/* Línea vertical entre pasos */}
                {index < steps.length - 1 && (
                  <div className="absolute left-4 top-10 bottom-0 w-px bg-border" />
                )}

                {/* Número */}
                <div className="relative flex-shrink-0 w-8 h-8 rounded-full border border-primary/40 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">{index + 1}</span>
                </div>

                {/* Texto */}
                <p className="text-muted-foreground leading-relaxed pt-1">{step}</p>
              </motion.li>
            ))}
          </ol>
        </motion.div>

        {/* Sin TACC */}
        <motion.div
          className="mt-16 p-8 border border-border rounded-lg"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-xl font-display mb-4 text-foreground">{t("glutenFreeOption")}</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Podés cambiar el panko por panko sin TACC. En este caso, en vez de pasar el producto crudo en la harina,
            pasalo primero por el panko sin TACC, luego por el huevo y por último el panko sin TACC nuevamente.
            Recordá usar un aceite renovado para no generar contaminación cruzada.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
