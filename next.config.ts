import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const railwayBackend =
      process.env.RAILWAY_BACKEND_URL ??
      "https://quill-and-ink-production.up.railway.app";

    return [
      {
        source: "/premium/checkout/:path*",
        destination: `${railwayBackend}/premium/checkout/:path*`,
      },
    ];
  },
};

export default nextConfig;