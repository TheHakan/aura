import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@better-auth/kysely-adapter",
    "kysely",
    "libsodium-wrappers",
  ],
};

export default nextConfig;
