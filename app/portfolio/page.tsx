import type { Metadata } from "next";
import { AirportSite } from "@/components/airport/Site";

// The same site, at a path that's used in one place only, so those visits can be told apart in
// analytics (see TAGGED_PATHS in app/posthog.tsx and ANALYTICS.md). Kept out of search results.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  robots: { index: false, follow: false },
};

export default function Portfolio() {
  return <AirportSite />;
}
