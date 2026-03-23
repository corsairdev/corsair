import { z } from 'zod';

export const HackerNewsItem = z.object({
	id: z.number(),
	type: z.enum(['job', 'story', 'comment', 'poll', 'pollopt']).optional(),
	by: z.string().optional(),
	title: z.string().optional(),
	url: z.string().optional(),
	text: z.string().optional(),
	score: z.number().optional(),
	time: z.number().optional(),
	descendants: z.number().optional(),
	parent: z.number().optional(),
	poll: z.number().optional(),
	kids: z.array(z.number()).optional(),
	parts: z.array(z.number()).optional(),
	dead: z.boolean().optional(),
	deleted: z.boolean().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const HackerNewsUser = z.object({
	id: z.string(),
	karma: z.number(),
	about: z.string().optional(),
	created: z.number().optional(),
	submitted: z.array(z.number()).optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type HackerNewsItem = z.infer<typeof HackerNewsItem>;
export type HackerNewsUser = z.infer<typeof HackerNewsUser>;
