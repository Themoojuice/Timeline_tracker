# Time on Site

Turns a Google Timeline export into a weekly table of when you arrived at work and when you left.

**Live page:** https://themoojuice.github.io/Timeline_tracker/

## Use it

1. Phone Settings → Location → Location services → Timeline → **Export Timeline data**.
2. Open the page, choose the file, press **Analyse**.
3. First time only: tick your workplaces and check the roster times. Both are remembered on that device.

Each export holds your whole history, so once a week is enough.

## Privacy

The page is one HTML file with no server and no outside scripts. The export is read inside your browser and never uploaded. `.gitignore` blocks `*.json` so an export can't be committed here by accident.

## How times are worked out

- Arrived and left come from Timeline's visit start and end at the places you ticked; times are cut to the minute.
- Off site for under 90 minutes stays part of the same stint. A longer gap starts a new stint, such as a recall.
- Early and over count only time on site outside the rostered start and finish.
- A time is marked ≈ when there's no location data for 30 minutes or more beside it.
