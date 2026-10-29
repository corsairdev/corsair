import { z } from 'zod';

/** @see https://www.textrazor.com/docs/rest — Account Object */
export const TextrazorAccount = z.object({
	id: z.string(),
	plan: z.string().optional(),
	concurrentRequestLimit: z.number().optional(),
	concurrentRequestsUsed: z.number().optional(),
	planDailyRequestsIncluded: z.number().optional(),
	requestsUsedToday: z.number().optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

/** @see https://www.textrazor.com/docs/rest — Dictionary Object */
export const TextrazorDictionary = z.object({
	id: z.string(),
	matchType: z.string().optional(),
	caseInsensitive: z.boolean().optional(),
	language: z.string().optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

/** @see https://www.textrazor.com/docs/rest — DictionaryEntry Object */
export const TextrazorDictionaryEntry = z.object({
	id: z.string(),
	text: z.string().optional(),
	data: z.record(z.string(), z.array(z.string())).optional(),
	dictionaryId: z.string().optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

/** @see https://www.textrazor.com/docs/rest — Category Object */
export const TextrazorCategory = z.object({
	id: z.string(),
	categoryId: z.string().optional(),
	label: z.string().optional(),
	query: z.string().optional(),
	classifierId: z.string().optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

/** @see https://www.textrazor.com/docs/rest — Entity Object */
export const TextrazorEntity = z.object({
	id: z.string(),
	entityId: z.string().nullable().optional(),
	matchedText: z.string().optional(),
	confidenceScore: z.number().optional(),
	relevanceScore: z.number().optional(),
	wikiLink: z.string().nullable().optional(),
	wikidataId: z.string().nullable().optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

export type TextrazorAccount = z.infer<typeof TextrazorAccount>;
export type TextrazorDictionary = z.infer<typeof TextrazorDictionary>;
export type TextrazorDictionaryEntry = z.infer<typeof TextrazorDictionaryEntry>;
export type TextrazorCategory = z.infer<typeof TextrazorCategory>;
export type TextrazorEntity = z.infer<typeof TextrazorEntity>;
