import { z } from 'zod';

export const SearchBrandsInputSchema = z.object({
	q: z.string().min(1).describe('Brand name to search for.'),
	method: z
		.enum(['match', 'typeahead'])
		.optional()
		.describe('match for full names, typeahead for a prefix. Default match.'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(25)
		.optional()
		.describe('How many brands to return, from 1 to 25. Default 10.'),
});

export const SearchBrandSchema = z
	.object({
		object: z.string().optional(),
		name: z.string(),
		domain: z.string(),
		logo_url: z.string().optional(),
	})
	.passthrough();

export const SearchBrandsResponseSchema = z
	.object({
		data: z.array(SearchBrandSchema),
		metadata: z
			.object({
				request_id: z.string().optional(),
			})
			.passthrough(),
	})
	.passthrough();

export const FetchLogoInputSchema = z.object({
	domain: z
		.string()
		.min(1)
		.regex(/^[a-z0-9.-]+$/i)
		.describe('Domain only, such as shopify.com. No scheme or path.'),
});

export const FetchLogoResponseSchema = z.object({
	url: z.string(),
	contentType: z.string(),
	status: z.literal(200),
});

export type SearchBrandsInput = z.infer<typeof SearchBrandsInputSchema>;
export type SearchBrandsResponse = z.infer<typeof SearchBrandsResponseSchema>;
export type FetchLogoInput = z.infer<typeof FetchLogoInputSchema>;
export type FetchLogoResponse = z.infer<typeof FetchLogoResponseSchema>;

export const LogoDevEndpointInputSchemas = {
	searchBrands: SearchBrandsInputSchema,
	fetchLogo: FetchLogoInputSchema,
} as const;

export const LogoDevEndpointOutputSchemas = {
	searchBrands: SearchBrandsResponseSchema,
	fetchLogo: FetchLogoResponseSchema,
} as const;
