import { z } from 'zod';

export const CarboneTemplate = z.object({
	versionId: z.string().optional(),
	id: z.string().nullable().optional(),
	name: z.string().optional(),
	category: z.string().optional(),
	type: z.string().optional(),
	size: z.number().optional(),
	comment: z.string().optional(),
	tags: z.array(z.string()).optional(),
	deployedAt: z.number().nullable().optional(),
	createdAt: z.number().optional(),
	expireAt: z.number().nullable().optional(),
	origin: z.number().optional(),
});
export type CarboneTemplate = z.infer<typeof CarboneTemplate>;

export const CarboneCategory = z.object({
	name: z.string(),
});
export type CarboneCategory = z.infer<typeof CarboneCategory>;

export const CarboneTag = z.object({
	name: z.string(),
});
export type CarboneTag = z.infer<typeof CarboneTag>;
