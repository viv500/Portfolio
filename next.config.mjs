/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // The airport site moved from /aviation to the root.
    return [{ source: "/aviation", destination: "/", permanent: false }];
  },
};

export default nextConfig;
