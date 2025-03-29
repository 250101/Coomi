/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com'],
  },
  // Asegúrate de que Next.js pueda encontrar las fuentes correctamente
  webpack(config) {
    return config;
  },
}

export default nextConfig

