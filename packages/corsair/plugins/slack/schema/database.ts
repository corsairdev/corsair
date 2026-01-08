import z from 'zod';

export const SlackMessage = z.object({
	id: z.string(),
	createdAt: z.coerce.date().optional(),
	channel: z.string(),
	text: z.string(),
	authorId: z.string().optional(),
});

export const SlackChannel = z.object({
	id: z.string(),
	name: z.string(),
	createdAt: z.coerce.date().optional(),
});

export type SlackMessage = z.infer<typeof SlackMessage>;
export type SlackChannel = z.infer<typeof SlackChannel>;
