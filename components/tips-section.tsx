"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { ChevronDown } from "lucide-react"

export default function TipsSection() {
  const { t } = useLanguage()
  const tips = t("tipTitles").split("|").map((title, index) => ({ title, content: t("tipBodies").split("|")[index] }))
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
            {t("cooking")}
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
