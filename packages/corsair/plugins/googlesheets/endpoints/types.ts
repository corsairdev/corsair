import { z } from 'zod';
import type {
	BatchUpdateSpreadsheetResponse,
	BatchUpdateValuesResponse,
	ClearValuesResponse,
	Spreadsheet,
	ValueRange,
} from '../types';

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

export const GoogleSheetsEndpointOutputSchemas = {
	spreadsheetsCreate: SpreadsheetSchema,
	spreadsheetsDelete: z.void(),
	sheetsAppendRow: BatchUpdateValuesResponseSchema,
	sheetsAppendOrUpdateRow: BatchUpdateValuesResponseSchema,
	sheetsGetRows: ValueRangeSchema,
	sheetsUpdateRow: BatchUpdateValuesResponseSchema,
	sheetsClearSheet: ClearValuesResponseSchema,
	sheetsCreateSheet: BatchUpdateSpreadsheetResponseSchema,
	sheetsDeleteSheet: BatchUpdateSpreadsheetResponseSchema,
	sheetsDeleteRowsOrColumns: BatchUpdateSpreadsheetResponseSchema,
} as const;

export type GoogleSheetsEndpointOutputs = {
	spreadsheetsCreate: Spreadsheet;
	spreadsheetsDelete: void;
	sheetsAppendRow: BatchUpdateValuesResponse;
	sheetsAppendOrUpdateRow: BatchUpdateValuesResponse;
	sheetsGetRows: ValueRange;
	sheetsUpdateRow: BatchUpdateValuesResponse;
	sheetsClearSheet: ClearValuesResponse;
	sheetsCreateSheet: BatchUpdateSpreadsheetResponse;
	sheetsDeleteSheet: BatchUpdateSpreadsheetResponse;
	sheetsDeleteRowsOrColumns: BatchUpdateSpreadsheetResponse;
};
