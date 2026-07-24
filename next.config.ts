import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Permite cargar las imágenes de Cloudinary
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", // Permite cargar las imágenes por defecto si falla alguna
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com", // Mantienes el soporte para imágenes de Shopify por si las usas
      },
    ],
  },
};

export default nextConfig;
