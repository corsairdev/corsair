import { z } from 'zod';

export const AimlApiModelEntity = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		provider: z.string().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export const AimlApiAssistantEntity = z
	.object({
		id: z.string(),
		model: z.string().optional(),
		name: z.string().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export const AimlApiThreadEntity = z
	.object({
		id: z.string(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export const AimlApiBatchEntity = z
	.object({
		id: z.string(),
		status: z.string().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export type AimlApiModelEntity = z.infer<typeof AimlApiModelEntity>;
export type AimlApiAssistantEntity = z.infer<typeof AimlApiAssistantEntity>;
export type AimlApiThreadEntity = z.infer<typeof AimlApiThreadEntity>;
export type AimlApiBatchEntity = z.infer<typeof AimlApiBatchEntity>;
