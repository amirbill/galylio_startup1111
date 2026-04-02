import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.samsung.com",
      },
      {
        protocol: "https",
        hostname: "media.ldlc.com",
      },
      {
        protocol: "https",
        hostname: "game-icons.net",
      },
      {
        protocol: "https",
        hostname: "spacenet.tn",
      },
      {
        protocol: "https",
        hostname: "www.spacenet.tn",
      },
      {
        protocol: "https",
        hostname: "mytek.tn",
      },
      {
        protocol: "https",
        hostname: "www.mytek.tn",
      },
      {
        protocol: "https",
        hostname: "tunisianet.com.tn",
      },
      {
        protocol: "https",
        hostname: "www.tunisianet.com.tn",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.parashop.tn",
      },
      {
        protocol: "https",
        hostname: "pharma-shop.tn",
      },
      {
        protocol: "https",
        hostname: "parafendri.tn",
      },
      {
        protocol: "https",
        hostname: "www.technopro-online.com",
      },
      {
        protocol: "https",
        hostname: "technopro-online.com",
      },
      {
        protocol: "https",
        hostname: "jumbo.tn",
      },
      {
        protocol: "https",
        hostname: "www.jumbo.tn",
      },
      {
        protocol: "https",
        hostname: "darty.tn",
      },
      {
        protocol: "https",
        hostname: "www.darty.tn",
      },
    ],
  },
  allowedDevOrigins: [
    'https://back-27em.onrender.com/api/v1/',
    'localhost:3000',
    '127.0.0.1:3000',
    '192.168.1.106:3000',
    '192.168.1.106',
  ],
  // rewrites removed to use direct API connection
};

export default nextConfig;
