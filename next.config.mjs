/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // The old site moved from /classic to /plain.
      { source: "/classic", destination: "/plain", permanent: false },
    ];
  },
};

export default nextConfig;
