var WEBHOOK_URL = "https://1385-2401-4900-1c7b-f365-4d40-2b11-d1c9-3c68.ngrok-free.app/api/webhook?tenant_id=default";

function onEditTrigger(e) {
  if (!e || !e.range) return;

  var sheet = e.range.getSheet();
  var payload = {
    spreadsheetId: e.source.getId(),
    sheetName: sheet.getName(),
    range: e.range.getA1Notation(),
    values: e.range.getValues(),
    eventType: "rangeUpdated",
    timestamp: new Date().toISOString()
  };

  UrlFetchApp.fetch(WEBHOOK_URL, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
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
    eventType: "rangeUpdated",
    timestamp: new Date().toISOString()
  };

  UrlFetchApp.fetch(WEBHOOK_URL, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  });
}

function createTriggers() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  ScriptApp.newTrigger("onEditTrigger").forSpreadsheet(ss).onEdit().create();
  ScriptApp.newTrigger("onChangeTrigger").forSpreadsheet(ss).onChange().create();
  
  Logger.log("Triggers created successfully!");
}

function removeTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    ScriptApp.deleteTrigger(trigger);
  });
  Logger.log("All triggers removed.");
}