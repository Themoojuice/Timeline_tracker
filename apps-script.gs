/**
 * Time on Site → Google Sheets
 *
 * 1. In a new Google Sheet: Extensions → Apps Script. Replace everything with this file and save.
 * 2. Deploy → New deployment → gear → Web app. Execute as: Me. Who has access: Anyone. Deploy.
 * 3. Allow access (Advanced → Go to … (unsafe) → Allow: it's your own script).
 * 4. Paste the Web app URL into Time on Site.
 *
 * Tabs it keeps up to date:
 *   This week  – the week you were viewing when you pressed Send
 *   All days   – every day ever sent; new days are added, changed days updated, nothing deleted
 *   Weeks      – one row per week, worked out from All days
 */

var DAY_TEXT_COLUMNS = [1, 2, 3, 4, 8, 9, 10, 11, 12]; // Date, Day, Arrived, Left, Rostered, Approximate, Sites, Notes, My note
var WEEK_HEAD = ['Week of', 'Days', 'On site (h)', 'Over (min)', 'Early (min)'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var data = JSON.parse(e.postData.contents);
    if (!data || data.app !== 'time-on-site' || !data.days || !data.week) throw new Error('Not a Time on Site upload');
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var all = upsertDays_(ss, data.days);
    writeTable_(ss, 'This week', data.week.rows, true);
    writeTable_(ss, 'Weeks', weeksFrom_(all), false);
    tidyTabs_(ss);
    return json_({ ok: true, url: ss.getUrl(), days: all.length - 1 });
  } catch (err) {
    return json_({ ok: false, error: String((err && err.message) || err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, app: 'time-on-site', url: SpreadsheetApp.getActiveSpreadsheet().getUrl() });
}

// Merge incoming days into "All days" by date. Incoming rows replace rows with the same date.
function upsertDays_(ss, incoming) {
  var head = incoming[0];
  var sh = ss.getSheetByName('All days');
  var byDate = {};
  if (sh && sh.getLastRow() > 1) {
    var width = Math.min(sh.getLastColumn(), head.length);
    sh.getRange(2, 1, sh.getLastRow() - 1, width).getValues().forEach(function (r) {
      var key = dateKey_(r[0]);
      if (key) { r[0] = key; byDate[key] = r; }
    });
  }
  incoming.slice(1).forEach(function (r) { byDate[String(r[0])] = r; });
  var rows = Object.keys(byDate).sort().reverse().map(function (k) { return byDate[k]; });
  var table = [head].concat(rows);
  writeTable_(ss, 'All days', table, true);
  return table;
}

function weeksFrom_(table) {
  var acc = {};
  table.slice(1).forEach(function (r) {
    var p = String(r[0]).split('-');
    if (p.length !== 3 || !r[2]) return; // skip note-only days (leave, days off) with no arrival
    var d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
    d.setUTCDate(d.getUTCDate() - (d.getUTCDay() + 6) % 7);
    var k = d.toISOString().slice(0, 10);
    var a = acc[k] || (acc[k] = [k, 0, 0, 0, 0]);
    a[1] += 1;
    a[2] += Number(r[4]) || 0;
    a[3] += Number(r[6]) || 0;
    a[4] += Number(r[5]) || 0;
  });
  var rows = Object.keys(acc).sort().reverse().map(function (k) {
    var a = acc[k];
    a[2] = Math.round(a[2] * 100) / 100;
    return a;
  });
  return [WEEK_HEAD].concat(rows);
}

function writeTable_(ss, name, table, isDayTable) {
  var sh = ss.getSheetByName(name) || ss.insertSheet(name);
  sh.clearContents();
  if (!table || !table.length) return sh;
  var w = table[0].length;
  var rows = table.map(function (r) {
    var o = r.slice(0, w);
    while (o.length < w) o.push('');
    return o;
  });
  // Plain-text formats first, so dates and times arrive exactly as sent.
  var textCols = isDayTable ? DAY_TEXT_COLUMNS : [1];
  textCols.forEach(function (c) { if (c <= w) sh.getRange(1, c, rows.length, 1).setNumberFormat('@'); });
  sh.getRange(1, 1, rows.length, w).setValues(rows);
  sh.getRange(1, 1, 1, w).setFontWeight('bold');
  sh.setFrozenRows(1);
  return sh;
}

function tidyTabs_(ss) {
  ['This week', 'All days', 'Weeks'].forEach(function (name, i) {
    var sh = ss.getSheetByName(name);
    if (sh) { ss.setActiveSheet(sh); ss.moveActiveSheet(i + 1); }
  });
  var blank = ss.getSheetByName('Sheet1');
  if (blank && blank.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(blank);
  ss.setActiveSheet(ss.getSheetByName('This week'));
}

function dateKey_(v) {
  if (Object.prototype.toString.call(v) === '[object Date]') {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  var s = String(v || '');
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '';
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
