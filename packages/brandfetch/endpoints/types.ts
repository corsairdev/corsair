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
	clientId: z.string().min(1).optional(),
});

export type SearchBrandsInput = z.infer<typeof SearchBrandsInputSchema>;

const SearchBrandsResponseSchema = z.array(
	z.object({
		icon: z.string().nullable(),
		name: z.string().nullable(),
		domain: z.string(),
		claimed: z.boolean(),
		brandId: z.string(),
	}),
);

export type SearchBrandsResponse = z.infer<typeof SearchBrandsResponseSchema>;

const GetCdnLogoInputSchema = z.object({
	domain: z.string().min(1),
	clientId: z.string().min(1).optional(),
});

export type GetCdnLogoInput = z.infer<typeof GetCdnLogoInputSchema>;

const GetCdnLogoResponseSchema = z.object({
	url: z.string(),
});

export type GetCdnLogoResponse = z.infer<typeof GetCdnLogoResponseSchema>;

const GetTransactionInfoInputSchema = z.object({
	transactionLabel: z.string().min(1),
	countryCode: z.string().regex(/^[A-Z]{2}$/, {
		message: 'countryCode must be an ISO 3166-1 alpha-2 code',
	}),
});

export type GetTransactionInfoInput = z.infer<
	typeof GetTransactionInfoInputSchema
>;

const GetTransactionInfoResponseSchema = GetBrandInfoResponseSchema;

export type GetTransactionInfoResponse = z.infer<
	typeof GetTransactionInfoResponseSchema
>;

const GetViewerInputSchema = z.object({});

export type GetViewerInput = z.infer<typeof GetViewerInputSchema>;

const ViewerApiKeyResponseSchema = z.object({
	type: z.literal('api-key'),
	id: z.string(),
	urn: z.string(),
	name: z.string().nullable(),
	createdAt: z.string().nullable(),
	usage: z.object({
		used: z.number(),
		quota: z.number(),
	}),
	organization: z.object({
		id: z.string(),
		urn: z.string(),
		name: z.string().nullable(),
	}),
});

const ViewerUserResponseSchema = z.object({
	type: z.literal('user'),
	id: z.string(),
	urn: z.string(),
	name: z.string().nullable(),
	email: z.string().nullable(),
	createdAt: z.string().nullable(),
});

const GetViewerResponseSchema = z.discriminatedUnion('type', [
	ViewerApiKeyResponseSchema,
	ViewerUserResponseSchema,
]);

export type GetViewerResponse = z.infer<typeof GetViewerResponseSchema>;

export type BrandfetchEndpointInputs = {
	getBrandInfo: GetBrandInfoInput;
	searchBrands: SearchBrandsInput;
	getCdnLogo: GetCdnLogoInput;
	getTransactionInfo: GetTransactionInfoInput;
	getViewer: GetViewerInput;
};

export type BrandfetchEndpointOutputs = {
	getBrandInfo: GetBrandInfoResponse;
	searchBrands: SearchBrandsResponse;
	getCdnLogo: GetCdnLogoResponse;
	getTransactionInfo: GetTransactionInfoResponse;
	getViewer: GetViewerResponse;
};

export const BrandfetchEndpointInputSchemas = {
	getBrandInfo: GetBrandInfoInputSchema,
	searchBrands: SearchBrandsInputSchema,
	getCdnLogo: GetCdnLogoInputSchema,
	getTransactionInfo: GetTransactionInfoInputSchema,
	getViewer: GetViewerInputSchema,
} as const;

export const BrandfetchEndpointOutputSchemas = {
	getBrandInfo: GetBrandInfoResponseSchema,
	searchBrands: SearchBrandsResponseSchema,
	getCdnLogo: GetCdnLogoResponseSchema,
	getTransactionInfo: GetTransactionInfoResponseSchema,
	getViewer: GetViewerResponseSchema,
} as const;
