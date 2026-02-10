import {
	GoogleSheetsSpreadsheet,
	GoogleSheetsSheet,
	GoogleSheetsRow,
} from './database';

export const GoogleSheetsSchema = {
	version: '1.0.0',
	entities: {
		spreadsheets: GoogleSheetsSpreadsheet,
		sheets: GoogleSheetsSheet,
		rows: GoogleSheetsRow,
	},
} as const;
