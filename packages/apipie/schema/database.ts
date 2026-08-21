import { z } from 'zod';

export const ApipieModelEntity = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		provider: z.string().optional(),
		type: z.string().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export const ApipieImageEntity = z
	.object({
		id: z.string(),
		prompt: z.string().optional(),
		model: z.string().optional(),
		url: z.string().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export type ApipieModelEntity = z.infer<typeof ApipieModelEntity>;
export type ApipieImageEntity = z.infer<typeof ApipieImageEntity>;
