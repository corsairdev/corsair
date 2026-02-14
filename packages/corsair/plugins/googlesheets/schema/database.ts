import { z } from 'zod';

export const GoogleSheetsSpreadsheet = z.object({
	spreadsheetId: z.string(),
	title: z.string().optional(),
	spreadsheetUrl: z.string().optional(),
	createdAt: z.coerce.date().optional(),
});

export const GoogleSheetsSheet = z.object({
	sheetId: z.string(),
	spreadsheetId: z.string(),
	title: z.string().optional(),
	index: z.number().optional(),
	createdAt: z.coerce.date().optional(),
});

export const GoogleSheetsRow = z.object({
	rowId: z.string(),
	spreadsheetId: z.string(),
	sheetName: z.string().optional(),
	range: z.string().optional(),
	values: z
		.array(z.union([z.string(), z.number(), z.boolean(), z.null()]))
		.optional(),
	createdAt: z.coerce.date().optional(),
});

export type GoogleSheetsSpreadsheet = z.infer<typeof GoogleSheetsSpreadsheet>;
export type GoogleSheetsSheet = z.infer<typeof GoogleSheetsSheet>;
export type GoogleSheetsRow = z.infer<typeof GoogleSheetsRow>;
