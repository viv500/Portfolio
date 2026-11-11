import { CheckIn } from "./CheckIn";
import { Wayfinding } from "./Wayfinding";
import { Departures } from "./Departures";
import { Cockpit } from "./Cockpit";
import { Takeoff } from "./Takeoff";
import { PaletteSwitch } from "./PaletteSwitch";
import { Gates } from "./Gates";
import { PassportControl } from "./PassportControl";
import { Passport } from "./Passport";
import { Arrivals } from "./Arrivals";
import { FlightProgress } from "./FlightProgress";
import { FlightSheet } from "./FlightSheet";
import { Runway } from "./GateHeader";

/** The airport site. `uncapped` turns off the take-off's speed limit (the /nolimit preview). */
export const AirportSite = ({ uncapped = false }: { uncapped?: boolean }) => (
  <main className="aviation relative w-full overflow-x-clip bg-wall text-ink">
    <Takeoff uncapped={uncapped} />
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
