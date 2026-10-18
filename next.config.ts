import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  async redirects() {
    // "See a sample report" opens the fictional sample company (lib/api SAMPLE_REPORT_SLUG).
    return [{ source: "/sample-report", destination: "/companies/brisa-people", permanent: false }];
  },
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
