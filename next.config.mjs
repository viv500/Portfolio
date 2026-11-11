/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // The old site moved from /classic to /plain.
    return [{ source: "/classic", destination: "/plain", permanent: false }];
  },
};

export default nextConfig;
