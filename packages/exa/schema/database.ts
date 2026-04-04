import z from 'zod';

export const ExaSearchResult = z.object({
	id: z.string(),
	url: z.string(),
	title: z.string().nullable().optional(),
	publishedDate: z.string().nullable().optional(),
	author: z.string().nullable().optional(),
	score: z.number().optional(),
	text: z.string().optional(),
	highlights: z.array(z.string()).optional(),
	highlightScores: z.array(z.number()).optional(),
	summary: z.string().optional(),
	query: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const ExaWebset = z.object({
	id: z.string(),
	status: z.enum(['idle', 'running', 'paused', 'done']).optional(),
	externalId: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const ExaImport = z.object({
	id: z.string(),
	websetId: z.string(),
	urls: z.array(z.string()).optional(),
	status: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const ExaMonitor = z.object({
	id: z.string(),
	websetId: z.string(),
	cadenceType: z.enum(['realtime', 'hourly', 'daily', 'weekly']).optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const ExaEvent = z.object({
	id: z.string(),
	type: z.string(),
	websetId: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const ExaWebhookConfig = z.object({
	id: z.string(),
	url: z.string(),
	events: z.array(z.string()).optional(),
	status: z.enum(['active', 'inactive']).optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export type ExaSearchResult = z.infer<typeof ExaSearchResult>;
export type ExaWebset = z.infer<typeof ExaWebset>;
export type ExaImport = z.infer<typeof ExaImport>;
export type ExaMonitor = z.infer<typeof ExaMonitor>;
export type ExaEvent = z.infer<typeof ExaEvent>;
export type ExaWebhookConfig = z.infer<typeof ExaWebhookConfig>;
