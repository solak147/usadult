import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Adult video and anime APIs return images from rotating source CDNs, so
  // load remote source images directly instead of requiring a fixed host list.
  images: { unoptimized: true },
};

export default nextConfig;
