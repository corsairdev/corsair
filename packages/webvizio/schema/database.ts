import { z } from 'zod';

export const WebvizioProject = z
	.object({
		uuid: z.string(),
		id: z.union([z.string(), z.number()]).optional(),
		name: z.string(),
		description: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
		created_at: z.coerce.date().nullable().optional(),
		updated_at: z.coerce.date().nullable().optional(),
	})
	.loose();

export type WebvizioProject = z.infer<typeof WebvizioProject>;

export const WebvizioWebhook = z
	.object({
		id: z.union([z.string(), z.number()]),
		url: z.string(),
		event: z.string(),
		created_at: z.coerce.date().nullable().optional(),
	})
	.loose();

export type WebvizioWebhook = z.infer<typeof WebvizioWebhook>;
