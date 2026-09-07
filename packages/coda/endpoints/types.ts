import { z } from 'zod';

// --- Whoami Schemas ---
const WhoamiInputSchema = z.object({});
export type WhoamiInput = z.infer<typeof WhoamiInputSchema>;

const WhoamiResponseSchema = z.object({
	name: z.string(),
	email: z.string(),
});
export type WhoamiResponse = z.infer<typeof WhoamiResponseSchema>;

// --- List Docs Schemas ---
const ListDocsInputSchema = z.object({
	limit: z.number().optional(),
	pageToken: z.string().optional(),
});
export type ListDocsInput = z.infer<typeof ListDocsInputSchema>;

const ListDocsResponseSchema = z.object({
	items: z.array(
		z.object({
			id: z.string(),
			type: z.string().optional(),
			name: z.string(),
			href: z.string().optional(),
			browserLink: z.string().optional(),
		}),
	),
	nextPageToken: z.string().optional(),
});
export type ListDocsResponse = z.infer<typeof ListDocsResponseSchema>;

// --- List Tables Schemas ---
const ListTablesInputSchema = z.object({
	docId: z.string(),
	limit: z.number().optional(),
	pageToken: z.string().optional(),
});
export type ListTablesInput = z.infer<typeof ListTablesInputSchema>;

const ListTablesResponseSchema = z.object({
	items: z.array(
		z.object({
			id: z.string(),
			type: z.string().optional(),
			name: z.string(),
			href: z.string().optional(),
			browserLink: z.string().optional(),
		}),
	),
	nextPageToken: z.string().optional(),
});
export type ListTablesResponse = z.infer<typeof ListTablesResponseSchema>;

// --- Insert Rows Schemas ---
const InsertRowsInputSchema = z.object({
	docId: z.string(),
	tableId: z.string(),
	rows: z.array(
		z.object({
			cells: z.array(
				z.object({
					column: z.string(),
					value: z.any(),
				}),
			),
		}),
	),
});
export type InsertRowsInput = z.infer<typeof InsertRowsInputSchema>;

const InsertRowsResponseSchema = z.object({
	requestId: z.string().optional(),
});
export type InsertRowsResponse = z.infer<typeof InsertRowsResponseSchema>;

// --- Exported Inputs & Outputs Maps ---
export type CodaEndpointInputs = {
	whoami: WhoamiInput;
	listDocs: ListDocsInput;
	listTables: ListTablesInput;
	insertRows: InsertRowsInput;
};

export type CodaEndpointOutputs = {
	whoami: WhoamiResponse;
	listDocs: ListDocsResponse;
	listTables: ListTablesResponse;
	insertRows: InsertRowsResponse;
};

export const CodaEndpointInputSchemas = {
	whoami: WhoamiInputSchema,
	listDocs: ListDocsInputSchema,
	listTables: ListTablesInputSchema,
	insertRows: InsertRowsInputSchema,
} as const;

export const CodaEndpointOutputSchemas = {
	whoami: WhoamiResponseSchema,
	listDocs: ListDocsResponseSchema,
	listTables: ListTablesResponseSchema,
	insertRows: InsertRowsResponseSchema,
} as const;
