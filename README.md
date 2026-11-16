# vivekjudemanoj.com

My personal site, designed as a trip through an airport: you take off from a cockpit, check in, then walk the gates past my experience, impact, projects, hackathons and an "about me" passport, and land at baggage claim for contact details and my résumé.

**Live:** https://www.vivekjudemanoj.com

## What's on it

| Section | What it shows |
| --- | --- |
| Take-off | An autoplay intro from the cockpit: brake release, the roll, rotation and the climb into the page. You can skip it with a scroll, a swipe or a key press, and the Replay button plays a longer version. |
| Check-in | A departures board with the name, role and a typed-out ACARS message. |
| A · Pilot's logbook | Experience, one logbook entry per role. Each entry opens the full story. |
| B · Flight deck | Internship results, shown as cockpit instruments. |
| C · Connecting flights | Projects as boarding passes, each with its write-up. |
| D · Passport control | Hackathons, with their stamps. |
| E · Passport | About me, in a passport you can page through. |
| F · Baggage claim | Contact links and the résumé. |

There are two palettes: golden hour (the default) and day. Both are in `app/globals.css` and you switch with the toggle in the bottom left. The palette is chosen before the page paints, so it never flashes the wrong theme.

The original bento-grid site is still at [`/plain`](https://www.vivekjudemanoj.com/plain).

## Stack

- Next.js 14 (App Router) and TypeScript
- Tailwind CSS, with colour tokens as CSS variables
- Framer Motion for the take-off timeline and the page animations
- Hand-drawn SVG for the cockpit, the instruments and the runway scene (no images or 3D libraries)
- PostHog and Vercel Analytics
- Deployed on Vercel from `main`

## Run locally

Requires Node 22.

```bash
npm install
npm run dev
```

Then open http://localhost:3000. Run `npm run build` to check a production build.

## Project layout

```
app/
  layout.tsx           fonts, metadata, and the pre-paint script (palette + take-off flag)
  page.tsx             the airport site
  plain/               the original bento site
  globals.css          palettes, colour tokens, shared styles
components/
  data/index.ts        all content: profile, roles, projects, hackathons, stack, education
  data/airport.ts      airport framing: flight numbers, stamps, boarding-pass codes
  airport/             one file per section (CheckIn, FlightLog, Cockpit, Gates, ...)
  airport/Takeoff.tsx  the intro: timeline, pacing, skip rules, runway scene
  airport/flightdeck/  cockpit art: shell, glareshield, displays, yokes, throttle quadrant
public/
  media/<project>/     project images and videos
  logos/               company and tech-stack logos (sources in logos/tech/SOURCES.md)
  resume.pdf
```

## Editing content

- **Text and links:** all text, links and media references live in `components/data/index.ts`. The airport framing (flight numbers, stamps, boarding-pass codes) lives in `components/data/airport.ts`.
- **Media:** put a project's images and videos in `public/media/<project>/`. They show on that project's page once the file exists.
- **Take-off timing:** the take-off is paced by `T` (the timeline) and `PACING` in `components/airport/Takeoff.tsx`. `standard` is the version that plays on page load; `immersive` is the Replay version.

## Notes

- With `prefers-reduced-motion` on, the take-off never plays and the page opens directly.
- Add `?notrack` to any URL to stop your own browser from being counted in analytics. `?track` turns counting back on.
- Every analytics event, its properties and suggested PostHog insights are listed in [ANALYTICS.md](ANALYTICS.md).
