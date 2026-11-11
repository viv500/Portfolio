import { AirportSite } from "@/components/airport/Site";

// Temporary preview: the same site with the take-off's scroll speed limit turned off.
export const metadata = { robots: { index: false } };

export default function NoLimit() {
  return <AirportSite uncapped />;
}
