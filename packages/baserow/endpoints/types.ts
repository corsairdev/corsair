import { z } from 'zod';

const ListRowsInputSchema = z.object({
	tableId: z.string(),
	page: z.number().int().positive().optional(),
	size: z.number().int().positive().optional(),
	search: z.string().optional(),
	orderBy: z.string().optional(),
});

const GetRowInputSchema = z.object({
	tableId: z.string(),
	rowId: z.number().int().positive(),
});

const CreateRowInputSchema = z.object({
	tableId: z.string(),
	data: z.record(z.string(), z.unknown()),
});

const UpdateRowInputSchema = z.object({
	tableId: z.string(),
	rowId: z.number().int().positive(),
	data: z.record(z.string(), z.unknown()),
});

const DeleteRowInputSchema = z.object({
	tableId: z.string(),
	rowId: z.number().int().positive(),
});

export type ListRowsInput = z.infer<typeof ListRowsInputSchema>;
export type GetRowInput = z.infer<typeof GetRowInputSchema>;
export type CreateRowInput = z.infer<typeof CreateRowInputSchema>;
export type UpdateRowInput = z.infer<typeof UpdateRowInputSchema>;
export type DeleteRowInput = z.infer<typeof DeleteRowInputSchema>;

export type ListRowsResponse = {
	count: number;
	next: string | null;
	previous: string | null;
	results: Record<string, unknown>[];
};

export type GetRowResponse = Record<string, unknown>;

export type CreateRowResponse = Record<string, unknown>;

export type UpdateRowResponse = Record<string, unknown>;

export type DeleteRowResponse = {
	success: boolean;
};

export type BaserowEndpointInputs = {
	listRows: ListRowsInput;
	getRow: GetRowInput;
	createRow: CreateRowInput;
	updateRow: UpdateRowInput;
	deleteRow: DeleteRowInput;
};

export type BaserowEndpointOutputs = {
	listRows: ListRowsResponse;
	getRow: GetRowResponse;
	createRow: CreateRowResponse;
	updateRow: UpdateRowResponse;
	deleteRow: DeleteRowResponse;
};

export const BaserowEndpointInputSchemas = {
	listRows: ListRowsInputSchema,
	getRow: GetRowInputSchema,
	createRow: CreateRowInputSchema,
	updateRow: UpdateRowInputSchema,
	deleteRow: DeleteRowInputSchema,
} as const;

export const BaserowEndpointOutputSchemas = {
	listRows: z.object({
		count: z.number(),
		next: z.string().nullable(),
		previous: z.string().nullable(),
		results: z.array(z.record(z.string(), z.unknown())),
	}),

	getRow: z.record(z.string(), z.unknown()),

	createRow: z.record(z.string(), z.unknown()),

	updateRow: z.record(z.string(), z.unknown()),

	deleteRow: z.object({
		success: z.boolean(),
	}),
} as const;
