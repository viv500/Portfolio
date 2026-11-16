# Analytics

The site sends events to PostHog (US cloud). This file lists every custom event, what it means and what it carries, so the PostHog event log is easy to read. The code lives in `lib/analytics.ts` (the event list and `track()`) and `app/posthog.tsx` (setup, links, panels, sections, scroll depth).

**Every custom event has a `summary` property**, a short sentence like *"Opened project: Explainable ECG Classification"* or *"Skipped the take-off with the Skip button at 2.3 s"*. To read it in the activity feed, add `summary` as a column: Activity → Configure columns → add `summary`. To read it in session replays, it shows in the event inspector.

To exclude your own visits, open the site once with `?notrack`. `?track` turns counting back on in that browser.

## Renamed on 2026-11-15

Older data stays under the old names in PostHog.

| Old name | New name |
| --- | --- |
| `resume opened` | `resume_opened` |
| `outbound link clicked` | `link_clicked` |
| `time_to_first_scroll` (`ms`) | `first_scroll` (`after_s`) |
| `takeoff_completed` (`ms`) | `takeoff_completed` (`duration_s`, plus more) |
| `takeoff_skipped` (`ms`) | `takeoff_skipped` (`at_s`, plus more) |

## Events

| Event | When it fires | Properties |
| --- | --- | --- |
| `takeoff_completed` | The intro take-off played to the end. | `duration_s` (real seconds), `pacing` (`standard` on page load, `immersive` on replay), `is_replay` |
| `takeoff_skipped` | The take-off was skipped. | `at_s`, `method` (`button` / `scroll` / `key`; phones can only use the button), `pacing`, `is_replay` |
| `takeoff_replayed` | Replay take-off was clicked. | none |
| `first_scroll` | The first scroll after the page appeared. | `after_s`: how long they looked before scrolling |
| `section_viewed` | A section sat in the middle of the screen for a second. Once per section per visit. | `section` (Check-in, Experience, Impact, Projects, Hackathons, About, Contact), `order` (1st, 2nd, … reached), `seconds_since_load` |
| `scroll_depth_reached` | 25 / 50 / 75 / 100% of the page reached. Once each per visit. | `percent` |
| `panel_opened` | A detail panel opened. | `kind` (`experience` / `project` / `hackathon` / `resume`), `slug`, `title` (company and role, or project name), `source` (`click` / `direct link` / `back/forward`) |
| `panel_closed` | A panel closed: × button, Esc, backdrop, or back button. | `kind`, `slug`, `title`, `seconds_open` |
| `resume_opened` | The résumé PDF was viewed or downloaded. | `action` (`view` / `download`), `from` (the button), `section`, `panel` |
| `link_clicked` | An outbound link was clicked. | `destination` (GitHub, LinkedIn, Devpost, Email, YouTube, or the site's domain), `label`, `url` (email addresses are never sent, only `mailto:`), `section`, `panel` (the open panel's title, if any) |
| `palette_changed` | The golden hour / day switch was used. | `to` (`golden` / `day`) |
| `passport_page_turned` | The About passport was opened, closed or paged by the visitor (not the automatic opening). | `page`, `page_name` (Identity, Interests, Moments, Cover), `direction` (`open` / `forward` / `back` / `close`) |
| `media_played` | A project video was played or unmuted. | `project` (the open panel), `video`, `action` (`play` / `unmute`) |

PostHog's own events are on as well:
- `$pageview` and `$pageleave`, including one per panel, since panels are `#routes`;
- `$autocapture` clicks. The Skip, Replay take-off and take-off Résumé buttons carry a readable `name` attribute.

### Sent with every event (super properties)

| Property | Values |
| --- | --- |
| `site` | `airport` (the main site) or `plain` (the old bento site at /plain) |
| `device_class` | `phone` (< 640 px), `tablet` (< 1024 px), `desktop` |
| `palette` | `golden` or `day`, updated when switched |
| `entry_section` | where the visit landed: `Check-in`, a section name, or a panel title for a direct link |
| `takeoff_seen` | `true` once the intro has finished or been skipped |

## Paste into PostHog

To add these descriptions, go to Data management → Events, open an event and click Edit, then paste its description. Properties are under Data management → Properties.

**Events**

- `takeoff_completed`: Intro take-off played to the end. duration_s is real seconds; pacing is standard on load, immersive on replay.
- `takeoff_skipped`: Intro take-off skipped. method = button / scroll / key; at_s = when.
- `takeoff_replayed`: Replay take-off button clicked.
- `first_scroll`: First scroll after the page appeared; after_s = seconds spent looking first.
- `section_viewed`: Section reached (in mid-screen for 1 s). Once per section per visit; order = nth reached.
- `scroll_depth_reached`: Scrolled 25/50/75/100% of the page. Once each per visit.
- `panel_opened`: Detail panel opened (experience, project, hackathon or résumé). title = what it is; source = click / direct link / back/forward.
- `panel_closed`: Detail panel closed; seconds_open = time spent reading.
- `resume_opened`: Résumé PDF viewed or downloaded (action).
- `link_clicked`: Outbound link clicked; destination = GitHub / LinkedIn / Devpost / Email / …
- `palette_changed`: Golden hour / day switch used; to = new palette.
- `passport_page_turned`: About passport opened, closed or paged by the visitor.
- `media_played`: Project video played or unmuted.

**Properties**

- `summary`: One-line, human-readable description of the event.
- `pacing`: Take-off version: standard (page load, ~4.6 s) or immersive (replay, ~13 s).
- `is_replay`: True when the take-off was started from Replay take-off.
- `method`: How the take-off was skipped: button, scroll or key.
- `kind`: Panel type: experience, project, hackathon or resume.
- `title`: The panel's subject: company and role, or project name.
- `source`: How the panel was opened: click, direct link or back/forward.
- `seconds_open`: How long the panel was open.
- `section`: Page section: Check-in, Experience, Impact, Projects, Hackathons, About, Contact.
- `destination`: Where an outbound link goes.
- `device_class`: phone, tablet or desktop, by window width.
- `entry_section`: Where the visit landed.
- `takeoff_seen`: The intro has finished or been skipped this visit.

## Starter insights

1. **Visit funnel:** a Funnel insight with these steps: `takeoff_completed` or `takeoff_skipped` → `first_scroll` → `panel_opened` → `resume_opened` or `link_clicked`.
2. **How far people get:** a Trends insight on `section_viewed`, breakdown by `section`, shown as a bar chart.
3. **Skip rate:** a Trends insight on `takeoff_skipped` and `takeoff_completed`, breakdown by `device_class`, filtered to `is_replay = false`.
4. **What gets read:** a Trends insight on `panel_opened`, breakdown by `title`. Add `panel_closed` with the average of `seconds_open`, broken down by `title`, for reading time.
5. **Where people go next:** a Trends insight on `link_clicked`, breakdown by `destination`.
