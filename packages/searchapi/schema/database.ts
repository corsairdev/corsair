import { z } from 'zod';

/** Account usage. https://www.searchapi.io/docs/account-api */
export const SearchApiAccountEntity = z.object({
	id: z.string().min(1),
	currentMonthUsage: z.number().optional(),
	monthlyAllowance: z.number().optional(),
	remainingCredits: z.number().optional(),
	remainingSearches: z.number().optional(),
	searchesThisHour: z.number().optional(),
	hourlyRateLimit: z.number().optional(),
	periodStart: z.string().optional(),
	periodEnd: z.string().optional(),
});

/** Location. https://www.searchapi.io/docs/locations-api */
export const SearchApiLocationEntity = z.object({
	id: z.string().min(1),
	name: z.string().optional(),
	canonicalName: z.string().optional(),
	countryCode: z.string().optional(),
	targetType: z.string().optional(),
});

/** Search metadata. The query and result rows are not stored. */
export const SearchApiSearchEntity = z.object({
	id: z.string().min(1),
	status: z.string().optional(),
	engine: z.string().optional(),
});

export type SearchApiAccountEntity = z.infer<typeof SearchApiAccountEntity>;
export type SearchApiLocationEntity = z.infer<typeof SearchApiLocationEntity>;
export type SearchApiSearchEntity = z.infer<typeof SearchApiSearchEntity>;
