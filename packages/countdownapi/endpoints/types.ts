import { z } from 'zod';

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

export type SearchInput = z.infer<typeof SearchInputSchema>;
export type ProductInput = z.infer<typeof ProductInputSchema>;
export type AutocompleteInput = z.infer<typeof AutocompleteInputSchema>;

export type SearchResponse = unknown;
export type ProductResponse = unknown;
export type AutocompleteResponse = unknown;

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
	search: z.unknown(),
	product: z.unknown(),
	autocomplete: z.unknown(),
} as const;
