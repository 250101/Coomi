"use client"

import { FormEvent, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, FolderHeart, Heart, Pencil, Plus, ShoppingBasket, Trash2 } from "lucide-react"
import { getRecipes } from "@/data/recipes"
import { useLanguage } from "@/contexts/language-context"
import { useSavedRecipes } from "@/contexts/saved-recipes-context"
import { useShoppingList } from "@/contexts/shopping-list-context"
import LanguageSwitcher from "@/components/language-switcher"
import ThemeToggle from "@/components/theme-toggle"
import Logo from "@/components/logo"
import SaveRecipeActions from "@/components/save-recipe-actions"

export default function SavedRecipesPage() {
  const { language, t } = useLanguage()
  const { favorites, collections, createCollection, renameCollection, deleteCollection } = useSavedRecipes()
  const { addIngredients } = useShoppingList()
  const [filter, setFilter] = useState("favorites")
  const [name, setName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const recipes = getRecipes(language)
  const visibleRecipes = useMemo(() => {
    const selectedIds = filter === "favorites" ? favorites : collections.find((collection) => collection.id === filter)?.recipeIds ?? []
    return recipes.filter((recipe) => selectedIds.includes(recipe.id))
  }, [collections, favorites, filter, recipes])
  const create = (event: FormEvent) => { event.preventDefault(); const id = createCollection(name); if (id) { setName(""); setFilter(id) } }

  return <main className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md"><div className="container mx-auto flex h-16 items-center justify-between px-4">
      <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft size={18} /><span className="hidden sm:inline">{t("backHome")}</span></Link><Logo size="small" /><div className="flex items-center gap-2"><ThemeToggle /><LanguageSwitcher /></div>
    </div></header>
    <section className="container mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <div className="mb-8 flex items-start gap-4"><div className="rounded-2xl bg-primary/10 p-3 text-primary"><FolderHeart size={28} /></div><div><h1 className="font-display text-4xl sm:text-5xl">{t("savedRecipes")}</h1><p className="mt-2 max-w-2xl text-muted-foreground">{t("savedRecipesDescription")}</p></div></div>
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-4">
          <nav aria-label={t("filterSavedRecipes")} className="space-y-2">
            <button onClick={() => setFilter("favorites")} className={`flex w-full items-center justify-between rounded-xl border p-3 text-left ${filter === "favorites" ? "border-primary bg-primary/10" : "border-border hover:border-primary/60"}`}><span className="flex items-center gap-2"><Heart size={17} />{t("favorites")}</span><span className="text-sm text-muted-foreground">{favorites.length}</span></button>
            {collections.map((collection) => <div key={collection.id} className={`rounded-xl border p-2 ${filter === collection.id ? "border-primary bg-primary/10" : "border-border"}`}>
              {editingId === collection.id ? <form onSubmit={(event) => { event.preventDefault(); renameCollection(collection.id, editingName); setEditingId(null) }} className="flex gap-1"><input autoFocus value={editingName} maxLength={60} onChange={(event) => setEditingName(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-input bg-background px-2 py-1.5 text-sm" aria-label={t("collectionName")} /><button className="rounded-lg bg-primary px-2 text-primary-foreground">{t("save")}</button></form> : <div className="flex items-center gap-1"><button onClick={() => setFilter(collection.id)} className="min-w-0 flex-1 truncate p-1 text-left">{collection.name} <span className="text-sm text-muted-foreground">({collection.recipeIds.length})</span></button><button onClick={() => { setEditingId(collection.id); setEditingName(collection.name) }} className="rounded-lg p-2 text-muted-foreground hover:text-primary" aria-label={`${t("renameCollection")}: ${collection.name}`}><Pencil size={15} /></button><button onClick={() => { if (window.confirm(t("deleteCollectionConfirm"))) { deleteCollection(collection.id); if (filter === collection.id) setFilter("favorites") } }} className="rounded-lg p-2 text-muted-foreground hover:text-destructive" aria-label={`${t("deleteCollection")}: ${collection.name}`}><Trash2 size={15} /></button></div>}
            </div>)}
          </nav>
          <form onSubmit={create} className="flex gap-2"><label htmlFor="collection-name" className="sr-only">{t("newCollectionName")}</label><input id="collection-name" value={name} maxLength={60} onChange={(event) => setName(event.target.value)} placeholder={t("newCollectionName")} className="min-w-0 flex-1 rounded-xl border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary" /><button disabled={!name.trim()} className="rounded-xl bg-primary p-2.5 text-primary-foreground disabled:opacity-40" aria-label={t("createCollection")}><Plus size={18} /></button></form>
        </aside>
        <div>
          <h2 className="mb-5 font-display text-3xl">{filter === "favorites" ? t("favorites") : collections.find((collection) => collection.id === filter)?.name}</h2>
          {visibleRecipes.length === 0 ? <div className="rounded-3xl border border-dashed border-border px-6 py-16 text-center"><FolderHeart className="mx-auto mb-4 text-muted-foreground" size={42} /><h3 className="font-display text-2xl">{t("noSavedRecipes")}</h3><p className="mt-2 text-muted-foreground">{t("noSavedRecipesHint")}</p><Link href="/" className="mt-6 inline-block rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground">{t("exploreRecipes")}</Link></div> : <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{visibleRecipes.map((recipe) => <article key={recipe.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"><Link href={`/recetas/${recipe.id}`} className="block"><div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${recipe.image})` }} /><div className="p-4"><h3 className="font-display text-xl">{recipe.name}</h3><p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{recipe.description}</p></div></Link><div className="flex items-center justify-between border-t border-border p-3"><SaveRecipeActions recipeId={recipe.id} compact /><button onClick={() => addIngredients(recipe.ingredients)} className="flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm hover:border-primary hover:text-primary" aria-label={`${t("addIngredientsToList")}: ${recipe.name}`}><ShoppingBasket size={16} /><span className="hidden xl:inline">{t("addToListShort")}</span></button></div></article>)}</div>}
        </div>
      </div>
    </section>
  </main>
}
