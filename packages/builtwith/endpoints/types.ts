import { z } from 'zod';

const BuiltWithResponseSchema = z.record(z.string(), z.unknown());

const CreateDomainListFileInputSchema = z.object({
	domains: z.array(z.string()).min(1),
	fileName: z.string().optional(),
	format: z.string().optional(),
});

const DatasetsLookupInputSchema = z.object({
	lookup: z.string(),
});

const DomainApiLookupInputSchema = z.object({
	lookup: z.string(),
	hidedl: z.boolean().optional(),
	hidetext: z.boolean().optional(),
	liveonly: z.boolean().optional(),
	nolive: z.boolean().optional(),
	nometa: z.boolean().optional(),
	nopii: z.boolean().optional(),
	noattr: z.boolean().optional(),
	trust: z.boolean().optional(),
});

const FinancialApiLookupInputSchema = z.object({
	lookup: z.string(),
});

const FreeApiLookupInputSchema = z.object({
	lookup: z.string(),
});

const ListsApiGetListInputSchema = z.object({
	tech: z.string(),
	all: z.boolean().optional(),
	country: z.string().optional(),
	meta: z.boolean().optional(),
	offset: z.number().int().nonnegative().optional(),
	since: z.string().optional(),
});

const McpApiLookupInputSchema = z.object({
	domain: z.string(),
});

const ProductApiLookupInputSchema = z.object({
	query: z.string(),
	limit: z.number().int().positive().max(500).optional(),
	page: z.number().int().positive().optional(),
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
	typeof BuiltWithResponseSchema
>;
export type DatasetsLookupResponse = z.infer<typeof BuiltWithResponseSchema>;
export type DomainApiLookupResponse = z.infer<typeof BuiltWithResponseSchema>;
export type FinancialApiLookupResponse = z.infer<
	typeof BuiltWithResponseSchema
>;
export type FreeApiLookupResponse = z.infer<typeof BuiltWithResponseSchema>;
export type ListsApiGetListResponse = z.infer<typeof BuiltWithResponseSchema>;
export type McpApiLookupResponse = z.infer<typeof BuiltWithResponseSchema>;
export type ProductApiLookupResponse = z.infer<typeof BuiltWithResponseSchema>;
export type RecommendationsApiLookupResponse = z.infer<
	typeof BuiltWithResponseSchema
>;
export type RedirectsApiLookupResponse = z.infer<
	typeof BuiltWithResponseSchema
>;
export type SocialApiLookupResponse = z.infer<typeof BuiltWithResponseSchema>;

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
	createDomainListFile: BuiltWithResponseSchema,
	datasetsLookup: BuiltWithResponseSchema,
	domainApiLookup: BuiltWithResponseSchema,
	financialApiLookup: BuiltWithResponseSchema,
	freeApiLookup: BuiltWithResponseSchema,
	listsApiGetList: BuiltWithResponseSchema,
	mcpApiLookup: BuiltWithResponseSchema,
	productApiLookup: BuiltWithResponseSchema,
	recommendationsApiLookup: BuiltWithResponseSchema,
	redirectsApiLookup: BuiltWithResponseSchema,
	socialApiLookup: BuiltWithResponseSchema,
} as const;
