import "./src/env.mjs";
import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "replicate.delivery",
      },
      {
        protocol: "https",
        hostname: "peaceful-antelope-743.convex.cloud",
      },
      {
        protocol: "https",
        hostname: "lovely-skunk-441.convex.cloud",
      },
      ...(process.env.NEXT_PUBLIC_VERCEL_URL
        ? [
            {
              protocol: "https",
              hostname: process.env.NEXT_PUBLIC_VERCEL_URL,
              pathname: "/_next/image/**",
            },
          ]
        : []),
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/_next/image/**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withSentryConfig(nextConfig, {
  silent: !process.env.CI,
  telemetry: false,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  tunnelRoute: "/monitoring",
});
