import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder editorial imagery. Add your own CDN/host here when real
    // product photography is uploaded.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
  experimental: {
    // three.js and friends ship large ESM — let Next optimize the imports.
    optimizePackageImports: ["framer-motion", "lucide-react", "@react-three/drei"],
  },
};

export default nextConfig;
