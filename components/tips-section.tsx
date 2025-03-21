"use client"

import { motion } from "framer-motion"

export default function TipsSection() {
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
        "Cuando haces risotto, recordá que podés abrir tu imaginación. La receta que te paso yo es de curry, pero podés hacer miles de formas. Lo importante es que juegues. Por ejemplo, se puede hacer un risotto clásico, y al final ponerle la crema de champiñones o la crema de boniato que te enseñé a hacer anteriormente.",
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

  return (
    <section className="tips-section" id="tips">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl md:text-5xl font-display text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Tips de Cocina
        </motion.h2>

        <div className="tips-grid">
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              className="tip-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="tip-header">
                <h3 className="tip-title">{tip.title}</h3>
              </div>
              <div className="tip-content">
                <p>{tip.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

