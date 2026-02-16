/*
 * Google Sheets does NOT have a native watch/push API like Gmail, Calendar, or Drive.
 * Instead, Sheets webhooks are powered by Google Apps Script triggers.
 *
 * SETUP:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Paste the code below into the script editor
 * 4. Replace WEBHOOK_URL with your actual webhook endpoint
 * 5. Run the "createTriggers" function once to install the triggers
 * 6. Authorize the script when prompted
 *
 * The Apps Script will POST to your webhook URL whenever rows are added or edited.
 */

const APPS_SCRIPT_CODE = `
var WEBHOOK_URL = "https://1385-2401-4900-1c7b-f365-4d40-2b11-d1c9-3c68.ngrok-free.app/api/webhook?tenant_id=default";

function onEditTrigger(e) {
  if (!e || !e.range) return;

  var sheet = e.range.getSheet();
  var payload = {
    spreadsheetId: e.source.getId(),
    sheetName: sheet.getName(),
    range: e.range.getA1Notation(),
    values: e.range.getValues(),
    eventType: "rowUpdated",
    timestamp: new Date().toISOString(),
  };

  UrlFetchApp.fetch(WEBHOOK_URL, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
  });
}

function onChangeTrigger(e) {
  if (!e) return;

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();

  if (lastRow === 0 || lastCol === 0) return;

  var values = sheet.getRange(lastRow, 1, 1, lastCol).getValues();

  var payload = {
    spreadsheetId: ss.getId(),
    sheetName: sheet.getName(),
    range: "A" + lastRow + ":" + String.fromCharCode(64 + lastCol) + lastRow,
    values: values,
    eventType: "rowAdded",
    timestamp: new Date().toISOString(),
  };

  UrlFetchApp.fetch(WEBHOOK_URL, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
  });
}

function createTriggers() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  ScriptApp.newTrigger("onEditTrigger")
    .forSpreadsheet(ss)
    .onEdit()
    .create();

  ScriptApp.newTrigger("onChangeTrigger")
    .forSpreadsheet(ss)
    .onChange()
    .create();

  Logger.log("Triggers created successfully!");
}

function removeTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    ScriptApp.deleteTrigger(trigger);
  });
  Logger.log("All triggers removed.");
}
`;

console.log("=== Google Sheets Webhook Setup ===\n");
console.log("Google Sheets uses Apps Script triggers instead of a watch() API.\n");
console.log("Steps:");
console.log("1. Open your Google Sheet");
console.log("2. Go to Extensions > Apps Script");
console.log("3. Paste the following code into the script editor:\n");
console.log(APPS_SCRIPT_CODE);
console.log("\n4. Replace YOUR_WEBHOOK_URL_HERE with your actual webhook endpoint");
console.log("5. Run the 'createTriggers' function once to install the triggers");
console.log("6. Authorize the script when prompted\n");
