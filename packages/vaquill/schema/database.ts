import z from 'zod';

export const VaquillSearchResult = z.object({
	actId: z.string(),
	citation: z.string().nullable().optional(),
	title: z.string().nullable().optional(),
	corpusType: z.string().nullable().optional(),
	state: z.string().nullable().optional(),
	excerpt: z.string().nullable().optional(),
	body: z.string().nullable().optional(),
	actStatus: z.string().nullable().optional(),
	goodLawStatus: z.string().nullable().optional(),
	query: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type VaquillSearchResult = z.infer<typeof VaquillSearchResult>;
