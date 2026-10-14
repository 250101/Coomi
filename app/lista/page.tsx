"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"
import { ArrowLeft, Check, Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useShoppingList } from "@/contexts/shopping-list-context"
import LanguageSwitcher from "@/components/language-switcher"
import ThemeToggle from "@/components/theme-toggle"
import Logo from "@/components/logo"

const format = (value: number) => Number.isInteger(value) ? String(value) : value.toLocaleString(undefined, { maximumFractionDigits: 2 })

export default function ShoppingListPage() {
  const { t } = useLanguage()
  const { items, addManual, updateQuantity, toggleItem, removeItem, clearChecked } = useShoppingList()
  const [name, setName] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [unit, setUnit] = useState("")
  const checkedCount = items.filter((item) => item.checked).length
  const submit = (event: FormEvent) => {
    event.preventDefault(); const cleanName = name.trim(); if (!cleanName) return
    addManual(cleanName, quantity, unit.trim() || t("units")); setName(""); setQuantity(1)
  }
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary" aria-label={t("backHome")}><ArrowLeft size={18} /><span className="hidden sm:inline">{t("backHome")}</span></Link>
          <Logo size="small" /><div className="flex items-center gap-2"><ThemeToggle /><LanguageSwitcher /></div>
        </div>
      </header>
      <section className="container mx-auto max-w-4xl px-4 py-10 sm:py-14">
        <div className="mb-8 flex items-start gap-4"><div className="rounded-2xl bg-primary/10 p-3 text-primary"><ShoppingBasket size={28} /></div><div><h1 className="font-display text-4xl sm:text-5xl">{t("shoppingList")}</h1><p className="mt-2 max-w-2xl text-muted-foreground">{t("shoppingListDescription")}</p></div></div>
        <form onSubmit={submit} className="mb-8 grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[1fr_90px_130px_auto]" aria-label={t("addManualProduct")}>
          <label className="sr-only" htmlFor="product-name">{t("product")}</label><input id="product-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} placeholder={t("productPlaceholder")} className="h-11 rounded-xl border border-input bg-background px-3 outline-none focus:ring-2 focus:ring-primary" />
          <label className="sr-only" htmlFor="product-quantity">{t("quantity")}</label><input id="product-quantity" type="number" min="1" max="999" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} className="h-11 rounded-xl border border-input bg-background px-3 outline-none focus:ring-2 focus:ring-primary" />
          <label className="sr-only" htmlFor="product-unit">{t("units")}</label><input id="product-unit" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder={t("units")} maxLength={30} className="h-11 rounded-xl border border-input bg-background px-3 outline-none focus:ring-2 focus:ring-primary" />
          <button className="h-11 rounded-xl bg-primary px-5 font-medium text-primary-foreground hover:opacity-90"><Plus className="mr-2 inline" size={17} />{t("add")}</button>
        </form>
        {items.length === 0 ? <div className="rounded-3xl border border-dashed border-border px-6 py-16 text-center"><ShoppingBasket className="mx-auto mb-4 text-muted-foreground" size={42} /><h2 className="font-display text-2xl">{t("emptyList")}</h2><p className="mt-2 text-muted-foreground">{t("emptyListHint")}</p><Link href="/" className="mt-6 inline-block rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground">{t("exploreRecipes")}</Link></div> : (
          <div className="space-y-3"><div className="mb-4 flex items-center justify-between text-sm text-muted-foreground"><span>{checkedCount} / {items.length} {t("purchased")}</span>{checkedCount > 0 && <button onClick={clearChecked} className="hover:text-primary">{t("removePurchased")}</button>}</div>
            {items.map((item) => <article key={item.id} className={`grid gap-4 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[auto_1fr_auto_auto] sm:items-center ${item.checked ? "opacity-55" : ""}`}>
              <button onClick={() => toggleItem(item.id)} className={`flex h-7 w-7 items-center justify-center rounded-lg border ${item.checked ? "border-primary bg-primary text-primary-foreground" : "border-input"}`} aria-label={`${item.checked ? t("markPending") : t("markPurchased")}: ${item.name}`}>{item.checked && <Check size={17} />}</button>
              <div><h2 className={`font-medium ${item.checked ? "line-through" : ""}`}>{item.name}</h2>{item.source === "recipe" && <p className="mt-1 text-xs text-muted-foreground">{t("recipeUses")} {format(item.requiredQuantity)} {item.requiredUnit} · {t("presentation")} {format(item.presentationQuantity)} {item.presentationUnit}</p>}</div>
              <div className="flex items-center gap-2" aria-label={`${t("purchaseQuantity")}: ${item.name}`}><button onClick={() => updateQuantity(item.id, item.purchaseQuantity - 1)} className="rounded-full border border-border p-2 hover:border-primary" aria-label={t("decreaseQuantity")}><Minus size={14} /></button><span className="min-w-24 text-center text-sm"><strong className="text-lg text-primary">{item.purchaseQuantity}</strong> {item.presentationLabel}{item.purchaseQuantity !== 1 ? "s" : ""}</span><button onClick={() => updateQuantity(item.id, item.purchaseQuantity + 1)} className="rounded-full border border-border p-2 hover:border-primary" aria-label={t("increaseQuantity")}><Plus size={14} /></button></div>
              <button onClick={() => removeItem(item.id)} className="justify-self-end rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label={`${t("remove")}: ${item.name}`}><Trash2 size={18} /></button>
            </article>)}
          </div>
        )}
      </section>
    </main>
  )
}
