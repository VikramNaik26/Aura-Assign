/** @type {import('next').NextConfig} */
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true
  },
  // swcMinify: true
});

const nextConfig = {
  images: {
    domains: ['res.cloudinary.com']
  },
};

export default withPWA(nextConfig);
