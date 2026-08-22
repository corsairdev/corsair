import { z } from 'zod';

const SysSchema = z
	.object({
		id: z.string(),
		type: z.string(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		version: z.number().optional(),
	})
	.passthrough();

const SpaceSchema = z
	.object({
		sys: SysSchema,
		name: z.string().optional(),
	})
	.passthrough();

const EnvironmentSchema = z
	.object({
		sys: SysSchema,
		name: z.string().optional(),
	})
	.passthrough();

const EntrySchema = z
	.object({
		sys: SysSchema,
		fields: z.record(z.string(), z.any()).optional(),
	})
	.passthrough();

const EntryListSchema = z
	.object({
		sys: z.object({ type: z.string() }).passthrough(),
		total: z.number(),
		skip: z.number(),
		limit: z.number(),
		items: z.array(EntrySchema),
	})
	.passthrough();

export const SpacesGetInputSchema = z.object({
	spaceId: z.string(),
});

export const EnvironmentsGetInputSchema = z.object({
	spaceId: z.string(),
	environmentId: z.string(),
});

export const EntriesGetInputSchema = z.object({
	spaceId: z.string(),
	environmentId: z.string(),
	entryId: z.string(),
});

export const EntriesListInputSchema = z.object({
	spaceId: z.string(),
	environmentId: z.string(),
	skip: z.number().optional(),
	limit: z.number().optional(),
	query: z.record(z.string(), z.string()).optional(),
});

export type SpacesGetInput = z.infer<typeof SpacesGetInputSchema>;
export type SpacesGetResponse = z.infer<typeof SpaceSchema>;

export type EnvironmentsGetInput = z.infer<typeof EnvironmentsGetInputSchema>;
export type EnvironmentsGetResponse = z.infer<typeof EnvironmentSchema>;

export type EntriesGetInput = z.infer<typeof EntriesGetInputSchema>;
export type EntriesGetResponse = z.infer<typeof EntrySchema>;

export type EntriesListInput = z.infer<typeof EntriesListInputSchema>;
export type EntriesListResponse = z.infer<typeof EntryListSchema>;

export type ContentfulEndpointInputs = {
	spacesGet: SpacesGetInput;
	environmentsGet: EnvironmentsGetInput;
	entriesGet: EntriesGetInput;
	entriesList: EntriesListInput;
};

export type ContentfulEndpointOutputs = {
	spacesGet: SpacesGetResponse;
	environmentsGet: EnvironmentsGetResponse;
	entriesGet: EntriesGetResponse;
	entriesList: EntriesListResponse;
};

export const ContentfulEndpointInputSchemas = {
	spacesGet: SpacesGetInputSchema,
	environmentsGet: EnvironmentsGetInputSchema,
	entriesGet: EntriesGetInputSchema,
	entriesList: EntriesListInputSchema,
} as const;

export const ContentfulEndpointOutputSchemas = {
	spacesGet: SpaceSchema,
	environmentsGet: EnvironmentSchema,
	entriesGet: EntrySchema,
	entriesList: EntryListSchema,
} as const;
