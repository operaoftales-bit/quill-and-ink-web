
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const voroaBackend = (
      process.env.VOROA_BACKEND_URL ??
      "https://quill-and-ink-twin-web.getvoroa.com"
    ).replace(/\/+$/, "");

    return [
      {
        source: "/premium/checkout/:path*",
        destination: `${voroaBackend}/premium/checkout/:path*`,
      },
    ];
  },
};

export default nextConfig;
