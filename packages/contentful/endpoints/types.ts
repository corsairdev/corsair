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

const ContentTypeSchema = z
	.object({
		sys: SysSchema,
		name: z.string().optional(),
		description: z.string().optional(),
		fields: z.array(z.record(z.string(), z.any())).optional(),
	})
	.passthrough();

const ContentTypeListSchema = z
	.object({
		sys: z.object({ type: z.string() }).passthrough(),
		total: z.number(),
		skip: z.number(),
		limit: z.number(),
		items: z.array(ContentTypeSchema),
	})
	.passthrough();

const AssetSchema = z
	.object({
		sys: SysSchema,
		fields: z.record(z.string(), z.any()).optional(),
	})
	.passthrough();

const AssetListSchema = z
	.object({
		sys: z.object({ type: z.string() }).passthrough(),
		total: z.number(),
		skip: z.number(),
		limit: z.number(),
		items: z.array(AssetSchema),
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

export const EntriesCreateInputSchema = z.object({
	spaceId: z.string(),
	environmentId: z.string(),
	contentTypeId: z.string(),
	fields: z.record(z.string(), z.any()),
});

export const EntriesUpdateInputSchema = z.object({
	spaceId: z.string(),
	environmentId: z.string(),
	entryId: z.string(),
	version: z.number(),
	fields: z.record(z.string(), z.any()),
});

export const ContentTypesGetInputSchema = z.object({
	spaceId: z.string(),
	environmentId: z.string(),
	contentTypeId: z.string(),
});

export const ContentTypesListInputSchema = z.object({
	spaceId: z.string(),
	environmentId: z.string(),
	skip: z.number().optional(),
	limit: z.number().optional(),
	query: z.record(z.string(), z.string()).optional(),
});

export const AssetsGetInputSchema = z.object({
	spaceId: z.string(),
	environmentId: z.string(),
	assetId: z.string(),
});

export const AssetsListInputSchema = z.object({
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

export type EntriesCreateInput = z.infer<typeof EntriesCreateInputSchema>;
export type EntriesCreateResponse = z.infer<typeof EntrySchema>;

export type EntriesUpdateInput = z.infer<typeof EntriesUpdateInputSchema>;
export type EntriesUpdateResponse = z.infer<typeof EntrySchema>;

export type ContentTypesGetInput = z.infer<typeof ContentTypesGetInputSchema>;
export type ContentTypesGetResponse = z.infer<typeof ContentTypeSchema>;

export type ContentTypesListInput = z.infer<typeof ContentTypesListInputSchema>;
export type ContentTypesListResponse = z.infer<typeof ContentTypeListSchema>;

export type AssetsGetInput = z.infer<typeof AssetsGetInputSchema>;
export type AssetsGetResponse = z.infer<typeof AssetSchema>;

export type AssetsListInput = z.infer<typeof AssetsListInputSchema>;
export type AssetsListResponse = z.infer<typeof AssetListSchema>;

export type ContentfulEndpointInputs = {
	spacesGet: SpacesGetInput;
	environmentsGet: EnvironmentsGetInput;
	entriesGet: EntriesGetInput;
	entriesList: EntriesListInput;
	entriesCreate: EntriesCreateInput;
	entriesUpdate: EntriesUpdateInput;
	contentTypesGet: ContentTypesGetInput;
	contentTypesList: ContentTypesListInput;
	assetsGet: AssetsGetInput;
	assetsList: AssetsListInput;
};

export type ContentfulEndpointOutputs = {
	spacesGet: SpacesGetResponse;
	environmentsGet: EnvironmentsGetResponse;
	entriesGet: EntriesGetResponse;
	entriesList: EntriesListResponse;
	entriesCreate: EntriesCreateResponse;
	entriesUpdate: EntriesUpdateResponse;
	contentTypesGet: ContentTypesGetResponse;
	contentTypesList: ContentTypesListResponse;
	assetsGet: AssetsGetResponse;
	assetsList: AssetsListResponse;
};

export const ContentfulEndpointInputSchemas = {
	spacesGet: SpacesGetInputSchema,
	environmentsGet: EnvironmentsGetInputSchema,
	entriesGet: EntriesGetInputSchema,
	entriesList: EntriesListInputSchema,
	entriesCreate: EntriesCreateInputSchema,
	entriesUpdate: EntriesUpdateInputSchema,
	contentTypesGet: ContentTypesGetInputSchema,
	contentTypesList: ContentTypesListInputSchema,
	assetsGet: AssetsGetInputSchema,
	assetsList: AssetsListInputSchema,
} as const;

export const ContentfulEndpointOutputSchemas = {
	spacesGet: SpaceSchema,
	environmentsGet: EnvironmentSchema,
	entriesGet: EntrySchema,
	entriesList: EntryListSchema,
	entriesCreate: EntrySchema,
	entriesUpdate: EntrySchema,
	contentTypesGet: ContentTypeSchema,
	contentTypesList: ContentTypeListSchema,
	assetsGet: AssetSchema,
	assetsList: AssetListSchema,
} as const;
