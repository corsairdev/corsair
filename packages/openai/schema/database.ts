import { z } from 'zod';

export const OpenaiAssistant = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
	model: z.string().optional(),
	description: z.string().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});
export type OpenaiAssistant = z.infer<typeof OpenaiAssistant>;

export const OpenaiThread = z.object({
	id: z.string(),
	createdAt: z.coerce.date().nullable().optional(),
});
export type OpenaiThread = z.infer<typeof OpenaiThread>;

export const OpenaiVectorStore = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
	status: z.string().optional(),
	usageBytes: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});
export type OpenaiVectorStore = z.infer<typeof OpenaiVectorStore>;
