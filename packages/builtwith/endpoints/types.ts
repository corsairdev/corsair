import { z } from 'zod';

/**
 * BuiltWith API responses are loosely typed on purpose: each endpoint returns a
 * different JSON shape and the provider adds fields without notice. A strict
 * schema would turn harmless provider additions into validation failures.
 */
const BuiltWithApiResponseSchema = z.record(z.string(), z.unknown());

const CreateDomainListFileInputSchema = z.object({
	domains: z.array(z.string().trim().min(1)).min(1),
	fileName: z.string().optional(),
	format: z.enum(['txt', 'zip']).optional().default('txt'),
});

const ListsApiGetListOutputSchema = z.looseObject({
	NextOffset: z.string().optional(),
	// List rows have provider-defined shapes; passed through untouched, never read by field.
	Results: z.array(z.record(z.string(), z.unknown())).optional(),
});

const McpApiLookupOutputSchema = z.array(
	z.looseObject({
		Domain: z.string().optional(),
		Category: z.string().optional(),
		Description: z.string().optional(),
		// Endpoint descriptors are provider-defined JSON; passed through untouched.
		Endpoints: z.array(z.record(z.string(), z.unknown())).optional(),
	}),
);

const CreateDomainListFileOutputSchema = z.object({
	fileName: z.string(),
	format: z.enum(['txt', 'zip']),
	content: z.string(),
	encoding: z.enum(['utf8', 'base64']),
	domainCount: z.number().int().nonnegative(),
	domains: z.array(z.string()),
});

const DatasetsLookupInputSchema = z.object({
	tech: z.string().min(1),
	date: z.string().optional(),
});

const DomainApiLookupInputSchema = z.object({
	lookup: z.string(),
	hidedl: z.boolean().optional(),
	hidetext: z.boolean().optional(),
	liveonly: z.boolean().optional(),
	nometa: z.boolean().optional(),
	nopii: z.boolean().optional(),
	noattr: z.boolean().optional(),
	trust: z.boolean().optional(),
	fdrange: z.string().optional(),
	ldrange: z.string().optional(),
});

const FinancialApiLookupInputSchema = z.object({
	lookup: z.string(),
});

const FreeApiLookupInputSchema = z.object({
	lookup: z.string(),
});

const ListsApiGetListInputSchema = z
	.object({
		tech: z.string().min(1),
		otherTechs: z.array(z.string().min(1)).max(16).optional(),
		all: z.boolean().optional(),
		country: z.string().optional(),
		meta: z.boolean().optional(),
		offset: z.string().optional(),
		since: z.string().optional(),
	})
	.refine((input) => !(input.all && input.since), {
		message: 'all cannot be combined with since',
	});

const McpApiLookupInputSchema = z
	.object({
		search: z.string().min(1).optional(),
		category: z.string().min(1).optional(),
		offset: z.number().int().nonnegative().optional(),
	})
	.refine((input) => input.search || input.category, {
		message: 'search or category is required',
	});

const ProductApiLookupInputSchema = z.object({
	query: z.string(),
	limit: z.number().int().positive().max(500).optional(),
	page: z.number().int().nonnegative().optional(),
});

const RecommendationsApiLookupInputSchema = z.object({
	lookup: z.string(),
});

const RedirectsApiLookupInputSchema = z.object({
	lookup: z.string(),
});

const SocialApiLookupInputSchema = z.object({
	lookup: z.string(),
});

export type CreateDomainListFileInput = z.infer<
	typeof CreateDomainListFileInputSchema
>;
export type DatasetsLookupInput = z.infer<typeof DatasetsLookupInputSchema>;
export type DomainApiLookupInput = z.infer<typeof DomainApiLookupInputSchema>;
export type FinancialApiLookupInput = z.infer<
	typeof FinancialApiLookupInputSchema
>;
export type FreeApiLookupInput = z.infer<typeof FreeApiLookupInputSchema>;
export type ListsApiGetListInput = z.infer<typeof ListsApiGetListInputSchema>;
export type McpApiLookupInput = z.infer<typeof McpApiLookupInputSchema>;
export type ProductApiLookupInput = z.infer<typeof ProductApiLookupInputSchema>;
export type RecommendationsApiLookupInput = z.infer<
	typeof RecommendationsApiLookupInputSchema
>;
export type RedirectsApiLookupInput = z.infer<
	typeof RedirectsApiLookupInputSchema
>;
export type SocialApiLookupInput = z.infer<typeof SocialApiLookupInputSchema>;

export type CreateDomainListFileResponse = z.infer<
	typeof CreateDomainListFileOutputSchema
>;
export type DatasetsLookupResponse = z.infer<typeof BuiltWithApiResponseSchema>;
export type DomainApiLookupResponse = z.infer<
	typeof BuiltWithApiResponseSchema
>;
export type FinancialApiLookupResponse = z.infer<
	typeof BuiltWithApiResponseSchema
>;
export type FreeApiLookupResponse = z.infer<typeof BuiltWithApiResponseSchema>;
export type ListsApiGetListResponse = z.infer<
	typeof ListsApiGetListOutputSchema
>;
export type McpApiLookupResponse = z.infer<typeof McpApiLookupOutputSchema>;
export type ProductApiLookupResponse = z.infer<
	typeof BuiltWithApiResponseSchema
>;
export type RecommendationsApiLookupResponse = z.infer<
	typeof BuiltWithApiResponseSchema
>;
export type RedirectsApiLookupResponse = z.infer<
	typeof BuiltWithApiResponseSchema
>;
export type SocialApiLookupResponse = z.infer<
	typeof BuiltWithApiResponseSchema
>;

export type BuiltWithEndpointInputs = {
	createDomainListFile: CreateDomainListFileInput;
	datasetsLookup: DatasetsLookupInput;
	domainApiLookup: DomainApiLookupInput;
	financialApiLookup: FinancialApiLookupInput;
	freeApiLookup: FreeApiLookupInput;
	listsApiGetList: ListsApiGetListInput;
	mcpApiLookup: McpApiLookupInput;
	productApiLookup: ProductApiLookupInput;
	recommendationsApiLookup: RecommendationsApiLookupInput;
	redirectsApiLookup: RedirectsApiLookupInput;
	socialApiLookup: SocialApiLookupInput;
};

export type BuiltWithEndpointOutputs = {
	createDomainListFile: CreateDomainListFileResponse;
	datasetsLookup: DatasetsLookupResponse;
	domainApiLookup: DomainApiLookupResponse;
	financialApiLookup: FinancialApiLookupResponse;
	freeApiLookup: FreeApiLookupResponse;
	listsApiGetList: ListsApiGetListResponse;
	mcpApiLookup: McpApiLookupResponse;
	productApiLookup: ProductApiLookupResponse;
	recommendationsApiLookup: RecommendationsApiLookupResponse;
	redirectsApiLookup: RedirectsApiLookupResponse;
	socialApiLookup: SocialApiLookupResponse;
};

export const BuiltWithEndpointInputSchemas = {
	createDomainListFile: CreateDomainListFileInputSchema,
	datasetsLookup: DatasetsLookupInputSchema,
	domainApiLookup: DomainApiLookupInputSchema,
	financialApiLookup: FinancialApiLookupInputSchema,
	freeApiLookup: FreeApiLookupInputSchema,
	listsApiGetList: ListsApiGetListInputSchema,
	mcpApiLookup: McpApiLookupInputSchema,
	productApiLookup: ProductApiLookupInputSchema,
	recommendationsApiLookup: RecommendationsApiLookupInputSchema,
	redirectsApiLookup: RedirectsApiLookupInputSchema,
	socialApiLookup: SocialApiLookupInputSchema,
} as const;

export const BuiltWithEndpointOutputSchemas = {
	createDomainListFile: CreateDomainListFileOutputSchema,
	datasetsLookup: BuiltWithApiResponseSchema,
	domainApiLookup: BuiltWithApiResponseSchema,
	financialApiLookup: BuiltWithApiResponseSchema,
	freeApiLookup: BuiltWithApiResponseSchema,
	listsApiGetList: ListsApiGetListOutputSchema,
	mcpApiLookup: McpApiLookupOutputSchema,
	productApiLookup: BuiltWithApiResponseSchema,
	recommendationsApiLookup: BuiltWithApiResponseSchema,
	redirectsApiLookup: BuiltWithApiResponseSchema,
	socialApiLookup: BuiltWithApiResponseSchema,
} as const;
