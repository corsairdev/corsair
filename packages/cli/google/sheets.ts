import * as p from '@clack/prompts';
import { copyToClipboard } from './shared';

const APPS_SCRIPT_TEMPLATE = (webhookUrl: string) => `var WEBHOOK_URL = "${webhookUrl}";

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
}`;

export async function setupSheetsWatch(webhookUrl: string): Promise<void> {
	const appsScriptCode = APPS_SCRIPT_TEMPLATE(webhookUrl);

	p.log.info('Google Sheets does not have a native watch API.');
	p.log.info(
		'Instead, you need to set up Google Apps Script triggers in your spreadsheet.',
	);
	p.log.info('');

	const shouldCopy = await p.confirm({
		message: 'Copy Apps Script code to clipboard?',
		initialValue: true,
	});

	let copied = false;
	if (shouldCopy) {
		copied = copyToClipboard(appsScriptCode);
		if (copied) {
			p.log.success('Apps Script code copied to clipboard!');
		} else {
			p.log.warn('Failed to copy to clipboard. Code will be displayed below.');
		}
	}

	p.log.info('');
	p.log.info('Setup Instructions:');
	p.log.info('1. Open your Google Sheet');
	p.log.info('2. Go to Extensions > Apps Script');
	p.log.info('3. Paste the code into the script editor');
	p.log.info('4. Run the "createTriggers" function once to install the triggers');
	p.log.info('5. Authorize the script when prompted');
	p.log.info('');

	if (!copied) {
		p.log.info('Apps Script Code:');
		p.log.info('');
		p.log.info(appsScriptCode);
		p.log.info('');
	}

	p.note(
		`Webhook URL: ${webhookUrl}\n\nThe Apps Script code ${copied ? 'has been copied to your clipboard' : 'is displayed above'}. Paste it into your Google Sheet's Apps Script editor.`,
		'Google Sheets Setup',
	);
}
