"use client"

import { useState } from "react"
import { Check, FolderPlus, Heart, Plus, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useSavedRecipes } from "@/contexts/saved-recipes-context"

export default function SaveRecipeActions({ recipeId, compact = false, light = false }: { recipeId: string; compact?: boolean; light?: boolean }) {
  const { t } = useLanguage()
  const { collections, isFavorite, toggleFavorite, toggleRecipeInCollection, createCollection } = useSavedRecipes()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const favorite = isFavorite(recipeId)
  const base = light ? "border-white/25 bg-black/25 text-white hover:bg-black/45" : "border-border bg-background/90 text-foreground hover:border-primary"
  const create = () => { const id = createCollection(name); if (id) { toggleRecipeInCollection(id, recipeId); setName("") } }

  return <div className="relative z-30 flex items-center gap-2">
    <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); toggleFavorite(recipeId) }} aria-pressed={favorite} aria-label={favorite ? t("removeFavorite") : t("addFavorite")} className={`flex items-center justify-center gap-2 rounded-full border p-2.5 transition-colors ${base} ${favorite ? "text-primary" : ""}`}>
      <Heart size={18} fill={favorite ? "currentColor" : "none"} />{!compact && <span className="text-sm">{favorite ? t("savedFavorite") : t("favorite")}</span>}
    </button>
    <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setOpen(true) }} aria-haspopup="dialog" aria-label={t("addToCollection")} className={`flex items-center justify-center gap-2 rounded-full border p-2.5 transition-colors ${base}`}>
      <FolderPlus size={18} />{!compact && <span className="text-sm">{t("collections")}</span>}
    </button>
    {open && <div role="dialog" aria-modal="true" aria-label={t("addToCollection")} onClick={(event) => event.stopPropagation()} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-5 text-foreground shadow-2xl">
        <div className="mb-4 flex items-center justify-between"><h2 className="font-display text-2xl">{t("addToCollection")}</h2><button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-muted" aria-label={t("close")}><X size={18} /></button></div>
        <div className="max-h-52 space-y-2 overflow-y-auto">
          {collections.length === 0 && <p className="py-3 text-sm text-muted-foreground">{t("noCollectionsYet")}</p>}
          {collections.map((collection) => { const selected = collection.recipeIds.includes(recipeId); return <button key={collection.id} onClick={() => toggleRecipeInCollection(collection.id, recipeId)} className={`flex w-full items-center justify-between rounded-xl border p-3 text-left ${selected ? "border-primary bg-primary/10" : "border-border hover:border-primary/60"}`} aria-pressed={selected}><span>{collection.name}</span>{selected && <Check size={17} className="text-primary" />}</button> })}
        </div>
        <div className="mt-4 flex gap-2 border-t border-border pt-4"><input value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") create() }} maxLength={60} placeholder={t("newCollectionName")} className="min-w-0 flex-1 rounded-xl border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary" /><button onClick={create} disabled={!name.trim()} className="rounded-xl bg-primary p-2.5 text-primary-foreground disabled:opacity-40" aria-label={t("createCollection")}><Plus size={18} /></button></div>
      </div>
    </div>}
  </div>
}
