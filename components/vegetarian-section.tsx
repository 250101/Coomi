"use client"

import { motion } from "framer-motion"

export default function VegetarianSection() {
  return (
    <section className="vegetarian-section" id="vegetarian">
      <motion.div
        className="vegetarian-content"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="text-4xl md:text-5xl font-display text-primary mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Opciones Vegetarianas
        </motion.h2>

        <motion.p
          className="text-lg mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          ¿Buscás alternativas sin carne? Podés reemplazar la carne en muchas de nuestras recetas con opciones
          vegetarianas. Una de nuestras favoritas es el Katsu de Berenjena Ahumada, que podés usar en lugar de la carne
          en recetas como el Katsudon o Katsu Curry.
        </motion.p>

        <motion.div
          className="vegetarian-steps"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-2xl font-display mb-6">Katsu de Berenjena Ahumada</h3>
          <ol className="space-y-4 mb-8">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                1
              </span>
              <span>Pelar una berenjena sin sacarle el tallo.</span>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                2
              </span>
              <span>Untar la berenjena con aceite de oliva, pimienta y un poco de sal.</span>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                3
              </span>
              <span>Envolverla en aluminio y dejarla en el horno a fuego fuerte por 15-20 minutos.</span>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                4
              </span>
              <span>
                Una vez que la sacas, la berenjena tiene que estar blanda como para aplastarla de a poquito, pero no se
                tiene que deshacer.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                5
              </span>
              <span>
                Cuando la tengas de un ancho considerado para una milanesa (1-1.5 cm), pasala por harina, después por
                huevo y finalmente por panko.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                6
              </span>
              <span>
                Freíla en aceite abundante y caliente, sacala cuando esté dorada, y rallale limón apenas sale.
              </span>
            </li>
          </ol>

          <h3 className="text-2xl font-display mb-4">Opción Sin TACC</h3>
          <p>
            Podés cambiar el panko por panko sin TACC. En este caso, en vez de pasar el producto crudo en la harina,
            pasalo primero por el panko sin TACC, luego por el huevo y por último el panko sin TACC nuevamente.
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}

