import { z } from 'zod';

const GetBrandInfoInputSchema = z.object({
	domain: z.string().min(1),
});

export type GetBrandInfoInput = z.infer<typeof GetBrandInfoInputSchema>;

const GetBrandInfoResponseSchema = z.object({
	id: z.string(),
	name: z.string().nullable(),
	domain: z.string(),
	claimed: z.boolean(),
	description: z.string().nullable(),
	longDescription: z.string().nullable(),
	links: z.array(z.unknown()),
	logos: z.array(z.unknown()),
	colors: z.array(z.unknown()),
	fonts: z.array(z.unknown()),
	images: z.array(z.unknown()),
	qualityScore: z.number(),
	company: z.unknown(),
	isNsfw: z.boolean(),
	urn: z.string(),
});

export type GetBrandInfoResponse = z.infer<typeof GetBrandInfoResponseSchema>;

const SearchBrandsInputSchema = z.object({
	query: z.string().min(1),
});

export type SearchBrandsInput = z.infer<typeof SearchBrandsInputSchema>;

const SearchBrandsResponseSchema = z.array(GetBrandInfoResponseSchema);

export type SearchBrandsResponse = z.infer<typeof SearchBrandsResponseSchema>;

const GetCdnLogoInputSchema = z.object({
	domain: z.string().min(1),
});

export type GetCdnLogoInput = z.infer<typeof GetCdnLogoInputSchema>;

const GetCdnLogoResponseSchema = z.object({
	url: z.string(),
});

export type GetCdnLogoResponse = z.infer<typeof GetCdnLogoResponseSchema>;

const GetCompanyInfoInputSchema = z.object({
	domain: z.string().min(1),
});

export type GetCompanyInfoInput = z.infer<typeof GetCompanyInfoInputSchema>;

const GetCompanyInfoResponseSchema = z.record(z.string(), z.unknown());

export type GetCompanyInfoResponse = z.infer<
	typeof GetCompanyInfoResponseSchema
>;

const GetTransactionInfoInputSchema = z.object({
	label: z.string().min(1),
});

export type GetTransactionInfoInput = z.infer<
	typeof GetTransactionInfoInputSchema
>;

const GetTransactionInfoResponseSchema = z.record(z.string(), z.unknown());

export type GetTransactionInfoResponse = z.infer<
	typeof GetTransactionInfoResponseSchema
>;

const GetTaxonomyInputSchema = z.object({});

export type GetTaxonomyInput = z.infer<typeof GetTaxonomyInputSchema>;

const GetTaxonomyResponseSchema = z.record(z.string(), z.unknown());

export type GetTaxonomyResponse = z.infer<typeof GetTaxonomyResponseSchema>;

const GetGraphqlVersionInputSchema = z.object({});

export type GetGraphqlVersionInput = z.infer<
	typeof GetGraphqlVersionInputSchema
>;

const GetGraphqlVersionResponseSchema = z.object({
	version: z.string(),
});

export type GetGraphqlVersionResponse = z.infer<
	typeof GetGraphqlVersionResponseSchema
>;

const ListSubscribableEventsInputSchema = z.object({});

export type ListSubscribableEventsInput = z.infer<
	typeof ListSubscribableEventsInputSchema
>;

const ListSubscribableEventsResponseSchema = z.object({
	events: z.array(z.string()),
});

export type ListSubscribableEventsResponse = z.infer<
	typeof ListSubscribableEventsResponseSchema
>;

const ListWebhooksInputSchema = z.object({});

export type ListWebhooksInput = z.infer<typeof ListWebhooksInputSchema>;

const ListWebhooksResponseSchema = z.object({
	webhooks: z.array(z.unknown()),
});

export type ListWebhooksResponse = z.infer<typeof ListWebhooksResponseSchema>;

export type BrandfetchEndpointInputs = {
	getBrandInfo: GetBrandInfoInput;
	searchBrands: SearchBrandsInput;
	getCdnLogo: GetCdnLogoInput;
	getCompanyInfo: GetCompanyInfoInput;
	getTransactionInfo: GetTransactionInfoInput;
	getTaxonomy: GetTaxonomyInput;
	getGraphqlVersion: GetGraphqlVersionInput;
	listSubscribableEvents: ListSubscribableEventsInput;
	listWebhooks: ListWebhooksInput;
};

export type BrandfetchEndpointOutputs = {
	getBrandInfo: GetBrandInfoResponse;
	searchBrands: SearchBrandsResponse;
	getCdnLogo: GetCdnLogoResponse;
	getCompanyInfo: GetCompanyInfoResponse;
	getTransactionInfo: GetTransactionInfoResponse;
	getTaxonomy: GetTaxonomyResponse;
	getGraphqlVersion: GetGraphqlVersionResponse;
	listSubscribableEvents: ListSubscribableEventsResponse;
	listWebhooks: ListWebhooksResponse;
};

export const BrandfetchEndpointInputSchemas = {
	getBrandInfo: GetBrandInfoInputSchema,
	searchBrands: SearchBrandsInputSchema,
	getCdnLogo: GetCdnLogoInputSchema,
	getCompanyInfo: GetCompanyInfoInputSchema,
	getTransactionInfo: GetTransactionInfoInputSchema,
	getTaxonomy: GetTaxonomyInputSchema,
	getGraphqlVersion: GetGraphqlVersionInputSchema,
	listSubscribableEvents: ListSubscribableEventsInputSchema,
	listWebhooks: ListWebhooksInputSchema,
} as const;

export const BrandfetchEndpointOutputSchemas = {
	getBrandInfo: GetBrandInfoResponseSchema,
	searchBrands: SearchBrandsResponseSchema,
	getCdnLogo: GetCdnLogoResponseSchema,
	getCompanyInfo: GetCompanyInfoResponseSchema,
	getTransactionInfo: GetTransactionInfoResponseSchema,
	getTaxonomy: GetTaxonomyResponseSchema,
	getGraphqlVersion: GetGraphqlVersionResponseSchema,
	listSubscribableEvents: ListSubscribableEventsResponseSchema,
	listWebhooks: ListWebhooksResponseSchema,
} as const;
