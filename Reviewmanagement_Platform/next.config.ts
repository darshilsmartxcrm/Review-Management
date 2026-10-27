import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['*', '152.59.32.58'],
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
