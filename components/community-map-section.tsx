"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import {
  Bookmark,
  Coffee,
  ExternalLink,
  Map,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  Star,
  Store,
  Utensils,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { communityPosts, type CommunityCategory } from "@/data/community"

type CategoryFilter = "all" | CommunityCategory

const categoryIcons = {
  restaurant: Utensils,
  cafe: Coffee,
  bakery: Store,
}

export default function CommunityMapSection() {
  const { language } = useLanguage()
  const es = language === "es"
  const [filter, setFilter] = useState<CategoryFilter>("all")
  const [selectedPostId, setSelectedPostId] = useState(communityPosts[0].id)
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return []
    try {
      const saved = JSON.parse(localStorage.getItem("coomiSavedPlaces") || "[]")
      return Array.isArray(saved) ? saved.filter((id): id is string => typeof id === "string") : []
    } catch {
      return []
    }
  })

  const visiblePosts = useMemo(
    () => communityPosts.filter((post) => filter === "all" || post.category === filter),
    [filter],
  )

  const activeSelectedPostId = visiblePosts.some((post) => post.id === selectedPostId)
    ? selectedPostId
    : visiblePosts[0]?.id ?? communityPosts[0].id

  const toggleSaved = (id: string) => {
    const next = savedIds.includes(id) ? savedIds.filter((savedId) => savedId !== id) : [...savedIds, id]
    setSavedIds(next)
    localStorage.setItem("coomiSavedPlaces", JSON.stringify(next))
  }

  const filters: Array<{ id: CategoryFilter; label: string }> = [
    { id: "all", label: es ? "Todo" : "All" },
    { id: "restaurant", label: es ? "Restaurantes" : "Restaurants" },
    { id: "cafe", label: es ? "Cafés" : "Cafés" },
    { id: "bakery", label: es ? "Panaderías" : "Bakeries" },
  ]

  return (
    <section id="forum" className="relative scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              <MessageCircle size={16} />
              {es ? "Comunidad Coomi" : "Coomi community"}
            </div>
            <h2 className="font-display text-5xl leading-none md:text-7xl">
              {es ? "Comé con los ojos." : "Eat with your eyes."}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {es
                ? "Descubrí restaurantes, cafés y panaderías a través de los platos que comparte la comunidad. Las reseñas que ves acá son de Coomi."
                : "Discover restaurants, cafés and bakeries through dishes shared by the community. Every review shown here belongs to Coomi."}
            </p>
          </div>
          <div className="inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-full border border-primary/35 bg-primary/10 px-5 py-3 font-semibold text-primary">
            <Plus size={19} />
            {es ? "Próximo: compartir un lugar" : "Next: share a place"}
          </div>
        </motion.div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2" aria-label={es ? "Filtrar lugares" : "Filter places"}>
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              aria-pressed={filter === item.id}
              className={`min-h-11 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors ${
                filter === item.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card/70 text-muted-foreground hover:border-primary/60 hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)]">
          <div className="space-y-6" aria-live="polite">
            {visiblePosts.map((post) => {
              const CategoryIcon = categoryIcons[post.category]
              const saved = savedIds.includes(post.id)
              return (
                <article
                  key={post.id}
                  id={`community-${post.id}`}
                  onMouseEnter={() => setSelectedPostId(post.id)}
                  className={`overflow-hidden rounded-3xl border bg-card shadow-lg transition-colors ${
                    activeSelectedPostId === post.id ? "border-primary/70" : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 p-4 md:p-5">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-sm font-bold text-primary">
                        {post.authorInitials}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm"><strong>{post.author}</strong> {es ? "recomienda" : "recommends"}</p>
                        <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                          <MapPin size={13} /> {post.placeName} · {post.city}
                        </p>
                      </div>
                    </div>
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      <CategoryIcon size={13} /> {post.specialty}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedPostId(post.id)}
                    className="group relative block aspect-[4/3] w-full overflow-hidden bg-muted text-left"
                    aria-label={`${es ? "Ver" : "View"} ${post.specialty} — ${post.placeName}`}
                  >
                    <Image
                      src={post.image}
                      alt={`${post.specialty} — ${post.placeName}`}
                      fill
                      sizes="(min-width: 1024px) 56vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent p-5 pt-16 text-white">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">{post.placeName}</p>
                      <h3 className="mt-1 text-2xl font-semibold">{post.specialty}</h3>
                    </div>
                  </button>

                  <div className="p-5">
                    <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
                      <span className="flex items-center gap-1 font-semibold text-primary"><Star size={16} fill="currentColor" /> {post.coomiRating.toFixed(1).replace(".", ",")}</span>
                      <span className="text-muted-foreground">{post.reviewCount} {es ? "reseñas en Coomi" : "Coomi reviews"}</span>
                    </div>
                    <p className="leading-relaxed text-foreground/85">“{post.review}”</p>
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => toggleSaved(post.id)}
                          aria-pressed={saved}
                          className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors ${saved ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                        >
                          <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
                          {saved ? (es ? "Guardado" : "Saved") : (es ? "Guardar" : "Save")}
                        </button>
                        <button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-muted px-4 text-sm text-muted-foreground hover:text-foreground">
                          <MessageCircle size={17} /> {post.reviewCount}
                        </button>
                      </div>
                      <a
                        href={post.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-medium text-muted-foreground hover:text-primary"
                      >
                        {es ? "Ver en Google Maps" : "View on Google Maps"} <ExternalLink size={15} />
                      </a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start" aria-label={es ? "Mapa de publicaciones" : "Post map"}>
            <div className="overflow-hidden rounded-3xl border border-border bg-[#0b1115] shadow-xl">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 p-4 text-white">
                <div>
                  <p className="flex items-center gap-2 font-semibold"><Map size={18} className="text-primary" /> {es ? "Cerca de la comunidad" : "Near the community"}</p>
                  <p className="mt-1 text-xs text-white/55">{es ? "Elegí un pin para ver el plato" : "Choose a pin to see the dish"}</p>
                </div>
                <button type="button" className="rounded-full border border-white/15 p-2.5 text-white/70 hover:text-white" aria-label={es ? "Buscar en el mapa" : "Search the map"}><Search size={18} /></button>
              </div>
              <div className="relative aspect-[4/5] overflow-hidden bg-[radial-gradient(circle_at_30%_20%,rgba(255,90,0,0.16),transparent_32%),linear-gradient(145deg,#101a20,#06090c)]">
                <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(32deg,transparent_46%,rgba(255,255,255,.18)_47%,transparent_49%),linear-gradient(118deg,transparent_44%,rgba(255,255,255,.12)_45%,transparent_47%)] [background-size:95px_120px,130px_100px]" />
                <div className="absolute left-[8%] top-[22%] h-px w-[85%] rotate-[18deg] bg-white/10" />
                <div className="absolute left-[20%] top-[8%] h-[90%] w-px rotate-[12deg] bg-white/10" />
                <div className="absolute right-[24%] top-[5%] h-[95%] w-px -rotate-[25deg] bg-white/10" />
                {visiblePosts.map((post) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => {
                      setSelectedPostId(post.id)
                      document.getElementById(`community-${post.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" })
                    }}
                    style={{ left: `${post.mapPosition.x}%`, top: `${post.mapPosition.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-1 transition-transform hover:scale-110 ${activeSelectedPostId === post.id ? "z-10 scale-110 bg-primary/25" : "bg-black/40"}`}
                    aria-label={`${post.placeName}, ${post.city}`}
                  >
                    <span className={`relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 ${activeSelectedPostId === post.id ? "border-primary" : "border-white"}`}>
                      <Image src={post.image} alt="" fill sizes="48px" className="object-cover" />
                    </span>
                    <span className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-2 rotate-45 bg-primary" />
                  </button>
                ))}
                <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/10 bg-black/70 p-4 text-white backdrop-blur-md">
                  <p className="text-xs uppercase tracking-[0.18em] text-primary">{es ? "Mapa social" : "Social map"}</p>
                  <p className="mt-1 text-sm text-white/75">
                    {es ? "Los pines con foto tienen contenido publicado en Coomi." : "Photo pins contain posts published on Coomi."}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
