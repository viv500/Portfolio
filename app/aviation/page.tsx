import { CheckIn } from "@/components/airport/CheckIn";
import { Wayfinding } from "@/components/airport/Wayfinding";
import { Departures } from "@/components/airport/Departures";
import { Cockpit } from "@/components/airport/Cockpit";
import { Takeoff } from "@/components/airport/Takeoff";
import { PaletteSwitch } from "@/components/airport/PaletteSwitch";
import { Gates } from "@/components/airport/Gates";
import { PassportControl } from "@/components/airport/PassportControl";
import { Passport } from "@/components/airport/Passport";
import { Arrivals } from "@/components/airport/Arrivals";
import { FlightProgress } from "@/components/airport/FlightProgress";
import { FlightSheet } from "@/components/airport/FlightSheet";
import { Runway } from "@/components/airport/GateHeader";

export const metadata = {
  title: "Vivek Jude Manoj | Aviation",
  description: "Backend & infrastructure engineer. Incoming at Shopify, previously Arctic Wolf and Rocket. Computer Science + AI at the University of Waterloo.",
};

export default function Aviation() {
  return (
    <main className="aviation relative w-full overflow-x-clip bg-wall text-ink">
      <Takeoff />
      <CheckIn />
      <Wayfinding />
      <Departures />
      <Cockpit />
      <Gates />
      <Runway />
      <PassportControl />
      <Runway />
      <Passport />
      <Arrivals />
      <FlightProgress />
      <FlightSheet />
      <PaletteSwitch />
    </main>
  );
}
