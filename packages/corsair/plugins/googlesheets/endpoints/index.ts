import * as Spreadsheets from './spreadsheets';
import * as Sheets from './sheets';

export const SpreadsheetsEndpoints = {
	create: Spreadsheets.create,
	delete: Spreadsheets.deleteSpreadsheet,
};

export const SheetsEndpoints = {
	appendRow: Sheets.appendRow,
	appendOrUpdateRow: Sheets.appendOrUpdateRow,
	getRows: Sheets.getRows,
	updateRow: Sheets.updateRow,
	clearSheet: Sheets.clearSheet,
	createSheet: Sheets.createSheet,
	deleteSheet: Sheets.deleteSheet,
	deleteRowsOrColumns: Sheets.deleteRowsOrColumns,
};

export * from './types';
