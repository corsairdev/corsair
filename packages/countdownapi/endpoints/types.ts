import { z } from 'zod';

// ---------------------------------------------------------------------------
// Input schemas
// ---------------------------------------------------------------------------

const SearchInputSchema = z.object({
	query: z.string().min(1),
	ebay_domain: z.string().min(1).default('ebay.com'),
});

const ProductInputSchema = z
	.object({
		url: z.string().url().optional(),
		epid: z.string().optional(),
		gtin: z.string().optional(),
		ebay_domain: z.string().min(1).default('ebay.com'),
		include_html: z.boolean().optional(),
		skip_gtin_cache: z.boolean().optional(),
		include_parts_compatibility: z.boolean().optional(),
	})
	.refine(
		(value) => Boolean(value.url) || Boolean(value.epid) || Boolean(value.gtin),
		{
			message: 'Provide at least one of url, epid, or gtin',
		},
	);

const AutocompleteInputSchema = z.object({
	query: z.string().min(1),
	ebay_domain: z.string().min(1).default('ebay.com'),
});

// ---------------------------------------------------------------------------
// Output schemas – modelled from CountdownAPI documentation.
// All object schemas use .passthrough() so that additional fields returned by
// the API in future versions are preserved rather than silently stripped.
// ---------------------------------------------------------------------------

const RequestMetadataSchema = z
	.object({
		id: z.string(),
		status: z.string(),
		created_at: z.string().optional(),
	})
	.passthrough();

const SearchParametersSchema = z
	.object({
		type: z.string(),
		ebay_domain: z.string().optional(),
	})
	.passthrough();

const PriceSchema = z
	.object({
		raw: z.string().optional(),
		value: z.number().optional(),
		currency: z.string().optional(),
	})
	.passthrough();

const SearchResultItemSchema = z
	.object({
		position: z.number().optional(),
		title: z.string(),
		link: z.string(),
		price: PriceSchema.optional(),
		thumbnail: z.string().optional(),
		rating: z.number().optional(),
		reviews_count: z.number().optional(),
	})
	.passthrough();

const SearchInformationSchema = z
	.object({
		total_results: z.number().optional(),
		page: z.number().optional(),
	})
	.passthrough();

const SearchResponseSchema = z
	.object({
		request_metadata: RequestMetadataSchema,
		search_parameters: SearchParametersSchema.optional(),
		search_information: SearchInformationSchema.optional(),
		search_results: z.array(SearchResultItemSchema),
	})
	.passthrough();

const ProductDetailsSchema = z
	.object({
		title: z.string(),
		link: z.string().optional(),
		price: PriceSchema.optional(),
		images: z.array(z.string()).optional(),
	})
	.passthrough();

const ProductResponseSchema = z
	.object({
		request_metadata: RequestMetadataSchema,
		search_parameters: SearchParametersSchema.optional(),
		product: ProductDetailsSchema,
	})
	.passthrough();

const AutocompleteResponseSchema = z
	.object({
		request_metadata: RequestMetadataSchema,
		search_parameters: SearchParametersSchema.optional(),
		autocomplete_results: z.array(z.string()),
	})
	.passthrough();

// ---------------------------------------------------------------------------
// Exported types
// ---------------------------------------------------------------------------

export type SearchInput = z.infer<typeof SearchInputSchema>;
export type ProductInput = z.infer<typeof ProductInputSchema>;
export type AutocompleteInput = z.infer<typeof AutocompleteInputSchema>;

export type SearchResponse = z.infer<typeof SearchResponseSchema>;
export type ProductResponse = z.infer<typeof ProductResponseSchema>;
export type AutocompleteResponse = z.infer<typeof AutocompleteResponseSchema>;

export type CountdownApiEndpointInputs = {
	search: SearchInput;
	product: ProductInput;
	autocomplete: AutocompleteInput;
};

export type CountdownApiEndpointOutputs = {
	search: SearchResponse;
	product: ProductResponse;
	autocomplete: AutocompleteResponse;
};

export const CountdownApiEndpointInputSchemas = {
	search: SearchInputSchema,
	product: ProductInputSchema,
	autocomplete: AutocompleteInputSchema,
} as const;

export const CountdownApiEndpointOutputSchemas = {
	search: SearchResponseSchema,
	product: ProductResponseSchema,
	autocomplete: AutocompleteResponseSchema,
} as const;
