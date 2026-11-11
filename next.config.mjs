/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // The airport site moved from /aviation to the root; the old site moved from /classic to /plain.
    return [
      { source: "/aviation", destination: "/", permanent: false },
      { source: "/classic", destination: "/plain", permanent: false },
    ];
  },
};

export default nextConfig;
