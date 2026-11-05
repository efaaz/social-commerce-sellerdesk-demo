import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pathao.com",
        pathname: "/logo.svg",
      },
      {
        protocol: "https",
        hostname: "redx.com.bd",
        pathname: "/images/new-redx-logo.svg",
      },
      {
        protocol: "https",
        hostname: "www.steadfast.com.bd",
        pathname: "/assets/images/favicon_io/favicon-32x32.png",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
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
