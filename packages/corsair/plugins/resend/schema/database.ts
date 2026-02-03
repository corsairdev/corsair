import { z } from 'zod';

export const ResendEmail = z.object({
	id: z.string(),
	from: z.string(),
	to: z.array(z.string()),
	subject: z.string().optional(),
	created_at: z.string(),
});

export const ResendDomain = z.object({
	id: z.string(),
	name: z.string(),
	status: z.enum(['not_started', 'validation', 'scheduled', 'ready', 'error', 'verified']),
	created_at: z.string(),
	region: z.string().optional(),
});

export type ResendEmail = z.infer<typeof ResendEmail>;
export type ResendDomain = z.infer<typeof ResendDomain>;
