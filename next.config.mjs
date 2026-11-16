/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // The old site moved from /classic to /plain.
      { source: "/classic", destination: "/plain", permanent: false },
      // A link used in one place only: lands on the home page, tagged for analytics (see ANALYTICS.md).
      { source: "/portfolio", destination: "/?via=portfolio", permanent: false },
    ];
  },
};

export default nextConfig;
