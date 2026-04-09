import { z } from 'zod';
import type {
	AppendValuesResponse,
	BatchUpdateSpreadsheetResponse,
	BatchUpdateValuesResponse,
	ClearValuesResponse,
	SheetProperties,
	Spreadsheet,
	UpdateValuesResponse,
	ValueRange,
} from '../types';

const SpreadsheetsCreateInputSchema = z.object({
	properties: z
		.object({
			title: z.string().optional(),
			locale: z.string().optional(),
			timeZone: z.string().optional(),
		})
		.optional(),
});

const SpreadsheetsDeleteInputSchema = z.object({
	spreadsheetId: z.string(),
});

const SheetsAppendRowInputSchema = z.object({
	spreadsheetId: z.string(),
	sheetName: z.string().optional(),
	range: z.string().optional(),
	values: z
		.array(z.union([z.string(), z.number(), z.boolean(), z.null()]))
		.optional(),
	valueInputOption: z.enum(['RAW', 'USER_ENTERED']).optional(),
	insertDataOption: z.enum(['OVERWRITE', 'INSERT_ROWS']).optional(),
});

const SheetsAppendOrUpdateRowInputSchema = z.object({
	spreadsheetId: z.string(),
	sheetName: z.string().optional(),
	keyColumn: z
		.string()
		.describe(
			'Column letter (e.g. "A"), not a header name (e.g. "Company Name")',
		)
		.optional(),
	keyValue: z.union([z.string(), z.number()]).optional(),
	values: z
		.array(z.union([z.string(), z.number(), z.boolean(), z.null()]))
		.optional(),
	valueInputOption: z.enum(['RAW', 'USER_ENTERED']).optional(),
	insertDataOption: z.enum(['OVERWRITE', 'INSERT_ROWS']).optional(),
});

const SheetsGetRowsInputSchema = z.object({
	spreadsheetId: z.string(),
	sheetName: z.string().optional(),
	range: z.string().optional(),
	valueRenderOption: z
		.enum(['FORMATTED_VALUE', 'UNFORMATTED_VALUE', 'FORMULA'])
		.optional(),
	dateTimeRenderOption: z
		.enum(['SERIAL_NUMBER', 'FORMATTED_STRING'])
		.optional(),
});

const SheetsUpdateRowInputSchema = z.object({
	spreadsheetId: z.string(),
	sheetName: z.string().optional(),
	range: z.string().optional(),
	rowIndex: z.number().optional(),
	values: z
		.array(z.union([z.string(), z.number(), z.boolean(), z.null()]))
		.optional(),
	valueInputOption: z.enum(['RAW', 'USER_ENTERED']).optional(),
});

const SheetsClearSheetInputSchema = z.object({
	spreadsheetId: z.string(),
	sheetName: z.string().optional(),
	range: z.string().optional(),
});

const SheetsCreateSheetInputSchema = z.object({
	spreadsheetId: z.string(),
	title: z.string().optional(),
});

const SheetsDeleteSheetInputSchema = z.object({
	spreadsheetId: z.string(),
	sheetId: z.number(),
});

const SheetsDeleteRowsOrColumnsInputSchema = z.object({
	spreadsheetId: z.string(),
	sheetId: z.number(),
	dimension: z.enum(['ROWS', 'COLUMNS']).optional(),
	startIndex: z.number().optional(),
	endIndex: z.number().optional(),
});

const SheetsListSheetsInputSchema = z.object({
	spreadsheetId: z.string(),
});

const SpreadsheetsListInputSchema = z.object({
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
	query: z.string().optional(),
});

export const GoogleSheetsEndpointInputSchemas = {
	spreadsheetsCreate: SpreadsheetsCreateInputSchema,
	spreadsheetsDelete: SpreadsheetsDeleteInputSchema,
	spreadsheetsList: SpreadsheetsListInputSchema,
	sheetsAppendRow: SheetsAppendRowInputSchema,
	sheetsAppendOrUpdateRow: SheetsAppendOrUpdateRowInputSchema,
	sheetsGetRows: SheetsGetRowsInputSchema,
	sheetsUpdateRow: SheetsUpdateRowInputSchema,
	sheetsClearSheet: SheetsClearSheetInputSchema,
	sheetsCreateSheet: SheetsCreateSheetInputSchema,
	sheetsDeleteSheet: SheetsDeleteSheetInputSchema,
	sheetsDeleteRowsOrColumns: SheetsDeleteRowsOrColumnsInputSchema,
	sheetsListSheetsInSpreadsheet: SheetsListSheetsInputSchema,
} as const;

export type GoogleSheetsEndpointInputs = {
	[K in keyof typeof GoogleSheetsEndpointInputSchemas]: z.infer<
		(typeof GoogleSheetsEndpointInputSchemas)[K]
	>;
};

const SpreadsheetPropertiesSchema = z.object({
	title: z.string().optional(),
	locale: z.string().optional(),
	autoRecalc: z.enum(['ON_CHANGE', 'ON_UPDATE', 'HOUR', 'MINUTE']).optional(),
	timeZone: z.string().optional(),
});

const SpreadsheetSchema = z.object({
	spreadsheetId: z.string().optional(),
	properties: SpreadsheetPropertiesSchema.optional(),
	spreadsheetUrl: z.string().optional(),
});

const ValueRangeSchema = z.object({
	range: z.string().optional(),
	majorDimension: z
		.enum(['ROWS', 'COLUMNS', 'DIMENSION_UNSPECIFIED'])
		.optional(),
	values: z
		.array(z.array(z.union([z.string(), z.number(), z.boolean(), z.null()])))
		.optional(),
});

const BatchUpdateValuesResponseSchema = z.object({
	spreadsheetId: z.string().optional(),
	totalUpdatedRows: z.number().optional(),
	totalUpdatedColumns: z.number().optional(),
	totalUpdatedCells: z.number().optional(),
	totalUpdatedSheets: z.number().optional(),
	responses: z.array(ValueRangeSchema).optional(),
});

const ClearValuesResponseSchema = z.object({
	spreadsheetId: z.string().optional(),
	clearedRange: z.string().optional(),
});

const SheetPropertiesSchema = z.object({
	sheetId: z.number().optional(),
	title: z.string().optional(),
	index: z.number().optional(),
	sheetType: z.enum(['GRID', 'OBJECT', 'DATA_SOURCE']).optional(),
	hidden: z.boolean().optional(),
});

const AddSheetResponseSchema = z.object({
	properties: SheetPropertiesSchema.optional(),
});

const BatchUpdateSpreadsheetResponseSchema = z.object({
	spreadsheetId: z.string().optional(),
	replies: z.array(z.any()).optional(),
	updatedSpreadsheet: SpreadsheetSchema.optional(),
});

const ListSheetsResponseSchema = z.object({
	spreadsheetId: z.string().optional(),
	sheets: z.array(SheetPropertiesSchema).optional(),
});

const SpreadsheetFileSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	createdTime: z.string().optional(),
	modifiedTime: z.string().optional(),
	webViewLink: z.string().optional(),
});

const ListSpreadsheetsResponseSchema = z.object({
	files: z.array(SpreadsheetFileSchema).optional(),
	nextPageToken: z.string().optional(),
});

export const GoogleSheetsEndpointOutputSchemas = {
	spreadsheetsCreate: SpreadsheetSchema,
	spreadsheetsDelete: z.void(),
	spreadsheetsList: ListSpreadsheetsResponseSchema,
	sheetsAppendRow: BatchUpdateValuesResponseSchema,
	sheetsAppendOrUpdateRow: BatchUpdateValuesResponseSchema,
	sheetsGetRows: ValueRangeSchema,
	sheetsUpdateRow: BatchUpdateValuesResponseSchema,
	sheetsClearSheet: ClearValuesResponseSchema,
	sheetsCreateSheet: BatchUpdateSpreadsheetResponseSchema,
	sheetsDeleteSheet: BatchUpdateSpreadsheetResponseSchema,
	sheetsDeleteRowsOrColumns: BatchUpdateSpreadsheetResponseSchema,
	sheetsListSheetsInSpreadsheet: ListSheetsResponseSchema,
} as const;

export type ListSheetsResponse = {
	spreadsheetId?: string;
	sheets?: SheetProperties[];
};

export type SpreadsheetFile = {
	id?: string;
	name?: string;
	createdTime?: string;
	modifiedTime?: string;
	webViewLink?: string;
};

export type ListSpreadsheetsResponse = {
	files?: SpreadsheetFile[];
	nextPageToken?: string;
};

export type GoogleSheetsEndpointOutputs = {
	spreadsheetsCreate: Spreadsheet;
	spreadsheetsDelete: void;
	spreadsheetsList: ListSpreadsheetsResponse;
	sheetsAppendRow: BatchUpdateValuesResponse;
	sheetsAppendOrUpdateRow: UpdateValuesResponse | AppendValuesResponse;
	sheetsGetRows: ValueRange;
	sheetsUpdateRow: BatchUpdateValuesResponse;
	sheetsClearSheet: ClearValuesResponse;
	sheetsCreateSheet: BatchUpdateSpreadsheetResponse;
	sheetsDeleteSheet: BatchUpdateSpreadsheetResponse;
	sheetsDeleteRowsOrColumns: BatchUpdateSpreadsheetResponse;
	sheetsListSheetsInSpreadsheet: ListSheetsResponse;
};
