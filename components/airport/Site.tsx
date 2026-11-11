import { CheckIn } from "./CheckIn";
import { Wayfinding } from "./Wayfinding";
import { FlightLog } from "./FlightLog";
import { Landing } from "./Landing";
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

/**
 * The airport site, as one journey: take-off → in flight (captain's PA, pilot's logbook, flight deck)
 * → landing → arrivals (connecting flights, passport control, passport, baggage claim).
 */
export const AirportSite = () => (
  <main className="aviation relative w-full overflow-x-clip bg-wall text-ink">
    <Takeoff />
    <CheckIn />
    <Wayfinding />
    {/* In flight */}
    <FlightLog />
    <Cockpit />
    <Landing />
    {/* On the ground */}
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
