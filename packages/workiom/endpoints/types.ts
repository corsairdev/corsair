import { z } from 'zod';
import {
	WorkiomApp,
	WorkiomFilter,
	WorkiomList,
	WorkiomRecord,
	WorkiomRecordPage,
} from '../schema';

export const AppsGetAllInputSchema = z.object({});
export type AppsGetAllInput = z.infer<typeof AppsGetAllInputSchema>;

export const AppsGetAllOutputSchema = z.object({
	items: z.array(WorkiomApp),
	totalCount: z.number().optional(),
});
export type AppsGetAllOutput = z.infer<typeof AppsGetAllOutputSchema>;

export const ListsGetInputSchema = z.object({
	id: z.string().min(1),
	expand: z.array(z.enum(['Fields', 'Views', 'Filters'])).optional(),
});
export type ListsGetInput = z.infer<typeof ListsGetInputSchema>;

export const ListsGetOutputSchema = WorkiomList;
export type ListsGetOutput = z.infer<typeof ListsGetOutputSchema>;

export const ListsGetAllInputSchema = z.object({
	appId: z
		.string()
		.min(1)
		.describe('Workiom app UUID from the app URL or Apps/GetAll'),
});
export type ListsGetAllInput = z.infer<typeof ListsGetAllInputSchema>;

export const ListsGetAllOutputSchema = z.object({
	items: z.array(WorkiomList),
	totalCount: z.number().optional(),
});
export type ListsGetAllOutput = z.infer<typeof ListsGetAllOutputSchema>;

export const RecordsGetAllInputSchema = z.object({
	listId: z.string().min(1),
	sorting: z
		.string()
		.optional()
		.describe("Official sort string, e.g. '11284 ASC' or '11284 DESC'"),
	maxResultCount: z.number().int().min(1).optional(),
	skipCount: z.number().int().min(0).optional(),
	filters: z.array(WorkiomFilter).optional(),
});
export type RecordsGetAllInput = z.infer<typeof RecordsGetAllInputSchema>;

export const RecordsGetAllOutputSchema = WorkiomRecordPage;
export type RecordsGetAllOutput = z.infer<typeof RecordsGetAllOutputSchema>;

export const RecordsCreateInputSchema = z.object({
	listId: z.string().min(1),
	record: z
		.record(z.string(), z.unknown())
		.describe('Field ID keys to values, per list metadata'),
});
export type RecordsCreateInput = z.infer<typeof RecordsCreateInputSchema>;

export const RecordsCreateOutputSchema = WorkiomRecord;
export type RecordsCreateOutput = z.infer<typeof RecordsCreateOutputSchema>;

export const RecordsUpdateInputSchema = z.object({
	listId: z.string().min(1),
	id: z.string().min(1),
	record: z
		.record(z.string(), z.unknown())
		.describe('Full record body; PUT replaces the record'),
});
export type RecordsUpdateInput = z.infer<typeof RecordsUpdateInputSchema>;

export const RecordsUpdateOutputSchema = WorkiomRecord;
export type RecordsUpdateOutput = z.infer<typeof RecordsUpdateOutputSchema>;

export const WorkiomEndpointInputSchemas = {
	appsGetAll: AppsGetAllInputSchema,
	listsGet: ListsGetInputSchema,
	listsGetAll: ListsGetAllInputSchema,
	recordsGetAll: RecordsGetAllInputSchema,
	recordsCreate: RecordsCreateInputSchema,
	recordsUpdate: RecordsUpdateInputSchema,
} as const;

export const WorkiomEndpointOutputSchemas = {
	appsGetAll: AppsGetAllOutputSchema,
	listsGet: ListsGetOutputSchema,
	listsGetAll: ListsGetAllOutputSchema,
	recordsGetAll: RecordsGetAllOutputSchema,
	recordsCreate: RecordsCreateOutputSchema,
	recordsUpdate: RecordsUpdateOutputSchema,
} as const;

export type WorkiomEndpointInputs = {
	[K in keyof typeof WorkiomEndpointInputSchemas]: z.infer<
		(typeof WorkiomEndpointInputSchemas)[K]
	>;
};

export type WorkiomEndpointOutputs = {
	[K in keyof typeof WorkiomEndpointOutputSchemas]: z.infer<
		(typeof WorkiomEndpointOutputSchemas)[K]
	>;
};
