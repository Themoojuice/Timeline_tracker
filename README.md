# Time on Site

Turns a Google Timeline export into filled-in AVAC (Attendance Variation and Allowance Claim) forms, one per week, ready to check, edit and print.

**Live page:** https://themoojuice.github.io/Timeline_tracker/

## Weekly use

1. Phone Settings → Location → Location services → Timeline → **Export Timeline data**.
2. Open Time on Site and tap **Import Timeline**.
3. The last 4 weeks in the file are listed, each with its total overtime. Tap a week to open its form.
4. Check the lines, change anything, then tap **Print** (A4 landscape) or print to PDF.

First time only: open **Settings**, tick your workplaces, check the roster and add your details (name, initials, personnel number, pay level, unit, location, delegate). They fill every form and are saved on that device only.

## The forms

Each week gets one line per entitlement, as the paper form asks: a shift's overtime on one line (actual finish past the rostered finish, written `Overtime 0:55`), a recall or extra stint on its own line (`Recall Onsite 1:45`). Dates and times are written the way the official form shows them (`19/01/2026`, `09:00`). Lines with at least the minimum overtime (15 min by default) start on the form.

On a form:

- The **total** is at the top, and a **Week total** prints under the Overtime/Oncall/Recall column (split by type if there's more than one).
- **Lines** lists every stint that week. Tick a line to put it on the form, untick to take it off, or tap it to change its times, entitlement, comment and so on. Changing a time updates that line's overtime. **+ Add a line** adds one by hand (pick the entitlement from the official list and its length fills in from the times).
- Every cell on the form itself can also be edited. Typing into an empty line adds it.
- **Rule off** draws the line through the unused rows. **Reset** rebuilds the week from the timeline.
- Changes are saved per week on the device, and stay attached to the right day if you import a newer export. More than 10 lines spill onto a second page.

Settings also cover a comment for every line (such as an internal order number), the default meal break (30 min), rounding of actual times to the nearest 5, 15 or 30 minutes, and whether arriving before rostered start counts as overtime (off by default, in which case actual start shows as the rostered start).

The layout follows the official form's fields and column proportions; it is not the official file and carries no government branding. The official AVAC is a dynamic Adobe (XFA) form that phone PDF viewers can't open, which is why the page draws its own. Check each form before you sign it.

## Install it

In Chrome on the phone: ⋮ → **Add to home screen** → **Install**, or tap **Install app** at the top of the page. It then opens like an app and works offline.

## Google Sheets (optional, under Settings → Extras)

1. Make a Google Sheet called *Time on Site*.
2. Extensions → Apps Script. Replace everything with [`apps-script.gs`](apps-script.gs) and save.
3. Deploy → New deployment → Web app. Execute as **Me**, Who has access **Anyone**. Deploy and allow access.
4. Paste the Web app URL into the *Google Sheets link* box.

The sheet gets **This week** (the latest week), **AVAC** (that week's lines as the timeline found them, without your form edits), **All days** (new days added, changed days updated, nothing deleted) and **Weeks**. The URL lets anyone who has it write to that sheet, so keep it private.

## Privacy

The location file is read inside your browser and never uploaded. The page keeps the parsed visits in this browser's storage so history outlives the phone's own Timeline; "Forget everything saved on this device" under Settings clears it, along with your details and form edits. `.gitignore` blocks `*.json` so an export can't be committed here by accident.

## How times are worked out

- Arrived and left come from Timeline's visit start and end at the places you ticked, cut to the minute.
- Off site for under 90 minutes stays part of the same stint. A longer gap starts a new stint, such as a recall.
- Early and over count only time on site outside the rostered start and finish.
- A time is marked ≈ when there's no location data for 30 minutes or more beside it.
- **Sharpening** (on by default when the export has raw GPS points): arrive becomes the first raw point inside the workplace and leave the last, but only when the neighbouring point outside is within 10 minutes and you stay on the same side for 10 minutes. The workplace boundary for raw points is learned from where your phone sits during visits there. Days that don't meet those rules keep Timeline's own times.
- **Rosters** can change by date: add a new roster from a rotation's first day, and earlier weeks keep the old one.
- A new export replaces saved data from its first day onwards; earlier saved days are kept. Raw GPS points near home are never kept.
