"use client"

import Link from "next/link"
import { ArrowLeft, Camera, ExternalLink, Plus, Sparkles } from "lucide-react"
import CommunityRealMap from "@/components/community-real-map"
import Logo from "@/components/logo"
import { useLanguage } from "@/contexts/language-context"
import { communityPosts } from "@/data/community"

export default function CommunityPage() {
  const { language } = useLanguage()
  const es = language === "es"

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={18} />{es ? "Volver" : "Back"}</Link>
          <Logo size="small" />
          <div className="w-20" />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.22em] text-primary"><Sparkles size={15} />{es ? "Mapa de la comunidad" : "Community map"}</p>
            <h1 className="mt-4 font-display text-5xl leading-none md:text-7xl">{es ? "Lo que encontró la comunidad." : "What the community found."}</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {es
                ? "Platos, cafés, panaderías, mercados e ingredientes que alguien de Coomi probó y decidió recomendar. Acá solo aparecen experiencias publicadas por la comunidad."
                : "Dishes, cafés, bakeries, markets and ingredients someone on Coomi tried and chose to recommend. Only community posts appear here."}
            </p>
          </div>
          <div className="inline-flex min-h-12 items-center gap-2 self-start rounded-full border border-primary/35 bg-primary/10 px-5 py-3 font-semibold text-primary lg:self-auto">
            <Plus size={19} />{es ? "Próximo: compartir un hallazgo" : "Next: share a discovery"}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <CommunityRealMap posts={communityPosts} language={language} />
          <aside className="rounded-3xl border border-border bg-card p-6 xl:self-start">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary"><Camera size={21} /></div>
            <h2 className="mt-5 font-display text-3xl">{es ? "Un pin nace de una foto" : "A pin begins with a photo"}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {es ? "Al publicar, buscás el lugar real en Google, añadís la foto del producto y contás por qué lo recomendás." : "When posting, find the real place on Google, add a product photo and explain why you recommend it."}
            </p>
            <ol className="mt-6 space-y-4 text-sm">
              <li className="flex gap-3"><span className="font-semibold text-primary">01</span><span>{es ? "Foto del plato o producto" : "Photo of the dish or product"}</span></li>
              <li className="flex gap-3"><span className="font-semibold text-primary">02</span><span>{es ? "Lugar vinculado con Google Places" : "Place linked through Google Places"}</span></li>
              <li className="flex gap-3"><span className="font-semibold text-primary">03</span><span>{es ? "Reseña y recomendación Coomi" : "Coomi review and recommendation"}</span></li>
            </ol>
            <div className="mt-6 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
              <ExternalLink className="mb-2 text-primary" size={16} />
              {es ? "Cada ficha podrá abrir la ubicación y las reseñas externas en Google Maps, sin mezclarlas con las reseñas Coomi." : "Each page can open its location and external reviews in Google Maps without mixing them with Coomi reviews."}
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
