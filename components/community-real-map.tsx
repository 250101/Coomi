"use client"

import { useEffect, useRef, useState } from "react"
import { importLibrary, setOptions } from "@googlemaps/js-api-loader"
import { Crosshair, MapPin } from "lucide-react"
import type { CommunityPost } from "@/data/community"

type Props = {
  posts: CommunityPost[]
  language: "es" | "en"
}

const defaultCenter = { lat: 40.4168, lng: -3.7038 }

export default function CommunityRealMap({ posts, language }: Props) {
  const es = language === "es"
  const mapNode = useRef<HTMLDivElement>(null)
  const map = useRef<google.maps.Map | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  useEffect(() => {
    if (!apiKey || !mapNode.current) return
    let cancelled = false

    const initialize = async () => {
      try {
        setOptions({ key: apiKey, v: "weekly", language })
        const { Map } = await importLibrary("maps")
        if (cancelled || !mapNode.current) return
        map.current = new Map(mapNode.current, {
          center: defaultCenter,
          zoom: 12,
          clickableIcons: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#11161b" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#b8bec5" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#11161b" }] },
            { featureType: "poi", stylers: [{ visibility: "off" }] },
            { featureType: "transit", stylers: [{ visibility: "off" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#293139" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#081f2b" }] },
          ],
        })

        if (posts.length > 0) {
          const bounds = new google.maps.LatLngBounds()
          posts.forEach((post) => {
            const position = { lat: post.latitude, lng: post.longitude }
            new google.maps.Marker({ map: map.current, position, title: post.specialty })
            bounds.extend(position)
          })
          map.current.fitBounds(bounds)
        }
        setMapReady(true)
      } catch (error) {
        console.error("Unable to load Google Maps", error)
        if (!cancelled) setLoadError(true)
      }
    }

    void initialize()
    return () => { cancelled = true }
  }, [apiKey, language, posts])

  const locateUser = () => {
    if (!navigator.geolocation || !map.current) return
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      map.current?.panTo({ lat: coords.latitude, lng: coords.longitude })
      map.current?.setZoom(14)
    })
  }

  return (
    <div className="relative h-[68vh] min-h-[520px] overflow-hidden rounded-3xl border border-border bg-[#0b1115] shadow-2xl">
      {apiKey && <div ref={mapNode} className="absolute inset-0" aria-label={es ? "Mapa de hallazgos de la comunidad" : "Community discoveries map"} />}

      {!apiKey && (
        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_45%,rgba(255,90,0,.12),transparent_28%),linear-gradient(145deg,#111820,#080b0e)] p-6 text-center">
          <div className="max-w-md">
            <MapPin className="mx-auto text-primary" size={38} />
            <h2 className="mt-5 font-display text-3xl text-white">{es ? "El mapa real está listo para conectarse" : "The real map is ready to connect"}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              {es
                ? "Configurá NEXT_PUBLIC_GOOGLE_MAPS_API_KEY para activar Google Maps. No se mostrarán negocios automáticamente."
                : "Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable Google Maps. Businesses will never appear automatically."}
            </p>
          </div>
        </div>
      )}

      {loadError && <div role="alert" className="absolute inset-x-4 top-4 rounded-xl bg-destructive p-3 text-sm text-destructive-foreground">{es ? "No se pudo cargar Google Maps." : "Google Maps could not be loaded."}</div>}

      {apiKey && mapReady && posts.length === 0 && (
        <div className="pointer-events-none absolute inset-x-4 bottom-4 mx-auto max-w-md rounded-2xl border border-white/10 bg-black/80 p-5 text-center text-white backdrop-blur-md">
          <p className="font-semibold">{es ? "Todavía no hay hallazgos en esta zona" : "There are no discoveries in this area yet"}</p>
          <p className="mt-1 text-sm text-white/60">{es ? "El primer pin aparecerá cuando alguien publique una experiencia real." : "The first pin will appear when someone shares a real experience."}</p>
        </div>
      )}

      {apiKey && mapReady && (
        <button type="button" onClick={locateUser} className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/75 p-3 text-white shadow-lg backdrop-blur" aria-label={es ? "Usar mi ubicación" : "Use my location"}>
          <Crosshair size={20} />
        </button>
      )}

      <div className="absolute left-4 top-4 rounded-full border border-primary/30 bg-black/75 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
        {posts.length} {es ? "hallazgos Coomi" : "Coomi discoveries"}
      </div>
    </div>
  )
}
