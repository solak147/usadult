import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // AdultEmbed returns thumbnails from rotating partner CDNs, so load the
  // source images directly instead of requiring a fixed Next Image host list.
  images: { unoptimized: true },
};

export default nextConfig;
