"use client"

import { ShieldCheck, Smartphone } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useDietaryPreferences } from "@/contexts/dietary-preferences-context"
import { allergens, type AllergenId } from "@/lib/dietary"

const available: AllergenId[] = ["gluten", "milk", "egg", "nuts", "soy", "sesame"]

export default function DietaryPreferences() {
  const { language } = useLanguage()
  const { selected, toggle, clear } = useDietaryPreferences()
  const es = language === "es"

  return (
    <section className="rounded-2xl border border-primary/25 bg-card/70 p-5" aria-labelledby="dietary-preferences-title">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><ShieldCheck size={21} /></span>
          <div>
            <h2 id="dietary-preferences-title" className="font-display text-2xl">{es ? "ALERGIAS Y ADAPTACIONES" : "ALLERGIES & ADAPTATIONS"}</h2>
            <p className="max-w-2xl text-sm text-muted-foreground">{es ? "Marcá lo que no podés consumir. Te mostraremos qué recetas son aptas, cuáles pueden adaptarse y cuáles contienen esos ingredientes." : "Select what you cannot consume. We’ll show suitable, adaptable, and incompatible recipes."}</p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground"><Smartphone size={13} />{es ? "Opcional · guardado solo en este dispositivo" : "Optional · stored only on this device"}</p>
          </div>
        </div>
        <div className="flex max-w-xl flex-wrap gap-2 lg:justify-end">
          {available.map((id) => {
            const active = selected.includes(id)
            return <button key={id} type="button" aria-pressed={active} onClick={() => toggle(id)} className={`rounded-full border px-3 py-2 text-sm transition-colors ${active ? "border-primary bg-primary text-white" : "border-border bg-background/60 text-foreground hover:border-primary"}`}><span aria-hidden="true" className="mr-1.5 font-semibold">{allergens[id].symbol}</span>{allergens[id][language]}</button>
          })}
          {selected.length > 0 && <button type="button" onClick={clear} className="px-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">{es ? "Limpiar" : "Clear"}</button>}
        </div>
      </div>
    </section>
  )
}
