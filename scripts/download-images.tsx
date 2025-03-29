// Este script te ayudará a descargar todas las imágenes
// Puedes ejecutarlo con: npx tsx scripts/download-images.tsx

import fs from "fs"
import path from "path"
import { imageUrls } from "../components/image-urls"

const downloadImage = async (url: string, filename: string) => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    }

    const buffer = await response.arrayBuffer()
    const outputPath = path.join(process.cwd(), "public/image", filename)

    fs.writeFileSync(outputPath, Buffer.from(buffer))
    console.log(`✅ Downloaded: ${filename}`)
  } catch (error) {
    console.error(`❌ Error downloading ${filename}:`, error)
  }
}

const downloadAllImages = async () => {
  // Asegúrate de que el directorio existe
  const dir = path.join(process.cwd(), "public/image")
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log("Created directory: public/image")
  }

  // Descarga cada imagen
  for (const image of imageUrls) {
    await downloadImage(image.url, image.name)
  }

  console.log("✨ All images downloaded successfully!")
}

downloadAllImages().catch(console.error)

