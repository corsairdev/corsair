import { z } from 'zod';
import {
	SearchApiAccountEntity,
	SearchApiLocationEntity,
	SearchApiSearchEntity,
} from '../schema/database';

export const EmptyInputSchema = z.object({});
export type EmptyInput = z.infer<typeof EmptyInputSchema>;

export const LocationInputSchema = z.object({
	q: z.string().min(1),
	limit: z.number().int().min(1).max(100).optional(),
});
export type LocationInput = z.infer<typeof LocationInputSchema>;

export const SearchInputSchema = z.object({
	engine: z.string().min(1),
	q: z.string().min(1),
});
export type SearchInput = z.infer<typeof SearchInputSchema>;

export const IdInputSchema = z.object({
	id: z.string().regex(/^[A-Za-z0-9_-]+$/),
});
export type IdInput = z.infer<typeof IdInputSchema>;

export const AccountResponseSchema = z.object({
	account: SearchApiAccountEntity,
});
export type AccountResponse = z.infer<typeof AccountResponseSchema>;

export const LocationListResponseSchema = z.object({
	locations: z.array(SearchApiLocationEntity),
});
export type LocationListResponse = z.infer<typeof LocationListResponseSchema>;

export const ResultSchema = z.object({
	position: z.number().optional(),
	title: z.string().optional(),
	link: z.string().optional(),
});

export const SearchResponseSchema = z.object({
	search: SearchApiSearchEntity,
	results: z.array(ResultSchema),
});
export type SearchResponse = z.infer<typeof SearchResponseSchema>;

export const HtmlResponseSchema = z.object({
	html: z.string(),
});
export type HtmlResponse = z.infer<typeof HtmlResponseSchema>;

export const EndpointInputSchemas = {
	'account.get': EmptyInputSchema,
	'locations.list': LocationInputSchema,
	'searches.run': SearchInputSchema,
	'searches.get': IdInputSchema,
	'searches.html': IdInputSchema,
} as const;

export const EndpointOutputSchemas = {
	'account.get': AccountResponseSchema,
	'locations.list': LocationListResponseSchema,
	'searches.run': SearchResponseSchema,
	'searches.get': SearchResponseSchema,
	'searches.html': HtmlResponseSchema,
} as const;
