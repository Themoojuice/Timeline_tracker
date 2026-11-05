# Time on Site

Turns a Google Timeline export into a weekly table of when you arrived at work and when you left.

**Live page:** https://themoojuice.github.io/Timeline_tracker/

## Weekly use

1. Phone Settings → Location → Location services → Timeline → **Export Timeline data**.
2. Open Time on Site and tap **Load Timeline export**. It analyses straight away.
3. Tap **Send to Google Sheets**.

First time only: tick your workplaces, check the roster, and link a sheet (below). All three are remembered on that device.

## AVAC lines

Under the week table, the **AVAC lines** card lays the week out in the paper Attendance Variation and Allowance Claim's column order and formats (date as 5/11, times as 0730), one line per entitlement: a shift's overtime on one line, a recall or extra stint on its own. Lines with at least the minimum overtime (15 min by default) start ticked; untick any you won't claim, and change the type (OT, Recall, On call, Add. shift, Leave) if needed. **Print** gives an A4 landscape sheet with every form column; **Copy lines** copies them for pasting, and Send to Google Sheets adds an **AVAC** tab.

Under *Form details and rules*: your personnel assignment number, name, pay level, unit and location (saved on the device only), a comment for every line such as an internal order number, a default meal break, rounding of actual times to the nearest 5, 15 or 30 minutes, and whether arriving early counts as overtime (off by default, in which case actual start shows as the rostered start).

## Install it

In Chrome on the phone: ⋮ → **Add to home screen** → **Install**, or tap **Install app** at the top of the page. It then opens like an app and works offline.

## Google Sheets (one-off setup, about 5 minutes)

1. Make a Google Sheet called *Time on Site*.
2. Extensions → Apps Script. Replace everything with [`apps-script.gs`](apps-script.gs) and save. (If you set it up before notes were added, paste the new version and use Deploy → Manage deployments → edit → New version.)
3. Deploy → New deployment → Web app. Execute as **Me**, Who has access **Anyone**. Deploy and allow access.
4. Paste the Web app URL into the page's *Google Sheets link* box.

The sheet gets three tabs: **This week**, **All days** (new days added, changed days updated, nothing deleted) and **Weeks**. The URL lets anyone who has it write to that sheet, so keep it private.

## Privacy

The location file is read inside your browser and never uploaded. The page keeps the parsed visits in this browser's storage so history outlives the phone's own Timeline; "Forget the data saved on this device" at the bottom clears it. Only the daily table goes to your sheet. `.gitignore` blocks `*.json` so an export can't be committed here by accident.

## How times are worked out

- Arrived and left come from Timeline's visit start and end at the places you ticked, cut to the minute.
- Off site for under 90 minutes stays part of the same stint. A longer gap starts a new stint, such as a recall.
- Early and over count only time on site outside the rostered start and finish.
- A time is marked ≈ when there's no location data for 30 minutes or more beside it.
- **Sharpening** (on by default when the export has raw GPS points): arrive becomes the first raw point inside the workplace and leave the last, but only when the neighbouring point outside is within 10 minutes and you stay on the same side for 10 minutes. The workplace boundary for raw points is learned from where your phone sits during visits there. Days that don't meet those rules keep Timeline's own times.
- **Rosters** can change by date: add a new roster from a rotation's first day, and earlier weeks keep the old one.
- **Notes** you add to a day are saved on the device and sent to the sheet in a *My note* column. Keep patient details out.
- A new export replaces saved data from its first day onwards; earlier saved days are kept. Raw GPS points near home are never kept.
