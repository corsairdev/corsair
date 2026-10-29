import { z } from 'zod';

export const ActiveTrailContact = z.object({
	id: z.union([z.string(), z.number()]).optional(),
	email: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const ActiveTrailCampaign = z.object({
	id: z.union([z.string(), z.number()]).optional(),
	name: z.string().optional(),
	subject: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const ActiveTrailGroup = z.object({
	id: z.union([z.string(), z.number()]).optional(),
	name: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type ActiveTrailContact = z.infer<typeof ActiveTrailContact>;
export type ActiveTrailCampaign = z.infer<typeof ActiveTrailCampaign>;
export type ActiveTrailGroup = z.infer<typeof ActiveTrailGroup>;
