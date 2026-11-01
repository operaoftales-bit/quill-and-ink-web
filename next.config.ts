
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const cloudflareBackend = (
      process.env.CLOUDFLARE_BACKEND_URL ??
      "https://quill-and-ink-payments.operaoftales.workers.dev"
    ).replace(/\/+$/, "");

    return [
      {
        source: "/premium/checkout/:path*",
        destination: `${cloudflareBackend}/premium/checkout/:path*`,
      },
    ];
  },
};

export default nextConfig;
