import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// apps.getAll
// ─────────────────────────────────────────────────────────────────────────────

const AppsGetAllInputSchema = z.object({});
export type AppsGetAllInput = z.infer<typeof AppsGetAllInputSchema>;

const WorkiomAppSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		description: z.string().optional(),
	})
	.passthrough();

const AppsGetAllResponseSchema = z.array(WorkiomAppSchema);
export type AppsGetAllResponse = z.infer<typeof AppsGetAllResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// lists.get
// ─────────────────────────────────────────────────────────────────────────────

const ListsGetInputSchema = z.object({
	id: z.string(),
	expand: z.array(z.enum(['Fields', 'Views', 'Filters'])).optional(),
});
export type ListsGetInput = z.infer<typeof ListsGetInputSchema>;

const WorkiomFieldSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		description: z.string().optional(),
		dataType: z.number(),
	})
	.passthrough();

const ListsGetResponseSchema = z
	.object({
		appId: z.string(),
		id: z.string(),
		name: z.string(),
		description: z.string().optional(),
		fields: z.array(WorkiomFieldSchema).optional(),
	})
	.passthrough();
export type ListsGetResponse = z.infer<typeof ListsGetResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// records.getAll  (POST /api/services/app/Data/All)
// ─────────────────────────────────────────────────────────────────────────────

const WorkiomFilterSchema = z.object({
	fieldId: z.number(),
	operator: z.number(),
	value: z.unknown(),
});

const RecordsGetAllInputSchema = z.object({
	listId: z.string(),
	sorting: z.string().optional(),
	maxResultCount: z.number().optional(),
	skipCount: z.number().optional(),
	filters: z.array(WorkiomFilterSchema).optional(),
});
export type RecordsGetAllInput = z.infer<typeof RecordsGetAllInputSchema>;

const RecordsGetAllResponseSchema = z
	.object({
		summary: z.record(z.string(), z.unknown()).optional(),
		totalCount: z.number(),
		items: z.array(z.record(z.string(), z.unknown())),
	})
	.passthrough();
export type RecordsGetAllResponse = z.infer<typeof RecordsGetAllResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// records.create  (POST /api/services/app/Data/Create?listId=)
// ─────────────────────────────────────────────────────────────────────────────

const RecordsCreateInputSchema = z.object({
	listId: z.string(),
	record: z.record(z.string(), z.unknown()),
});
export type RecordsCreateInput = z.infer<typeof RecordsCreateInputSchema>;

const RecordsCreateResponseSchema = z.record(z.string(), z.unknown());
export type RecordsCreateResponse = z.infer<typeof RecordsCreateResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Aggregates
// ─────────────────────────────────────────────────────────────────────────────

export type WorkiomEndpointInputs = {
	appsGetAll: AppsGetAllInput;
	listsGet: ListsGetInput;
	recordsGetAll: RecordsGetAllInput;
	recordsCreate: RecordsCreateInput;
};

export type WorkiomEndpointOutputs = {
	appsGetAll: AppsGetAllResponse;
	listsGet: ListsGetResponse;
	recordsGetAll: RecordsGetAllResponse;
	recordsCreate: RecordsCreateResponse;
};

export const WorkiomEndpointInputSchemas = {
	appsGetAll: AppsGetAllInputSchema,
	listsGet: ListsGetInputSchema,
	recordsGetAll: RecordsGetAllInputSchema,
	recordsCreate: RecordsCreateInputSchema,
} as const;

export const WorkiomEndpointOutputSchemas = {
	appsGetAll: AppsGetAllResponseSchema,
	listsGet: ListsGetResponseSchema,
	recordsGetAll: RecordsGetAllResponseSchema,
	recordsCreate: RecordsCreateResponseSchema,
} as const;
