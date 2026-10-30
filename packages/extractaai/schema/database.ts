import { z } from 'zod';

export const ExtractaaiExtraction = z.object({
	id: z.string(),
	extractionId: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	language: z.string().nullable().optional(),
	status: z.string().nullable().optional(),
	createdAt: z.number().nullable().optional(),
	updatedAt: z.number().nullable().optional(),
});

export type ExtractaaiExtraction = z.infer<typeof ExtractaaiExtraction>;

export const ExtractaaiClassification = z.object({
	id: z.string(),
	classificationId: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	createdAt: z.number().nullable().optional(),
	updatedAt: z.number().nullable().optional(),
});

export type ExtractaaiClassification = z.infer<typeof ExtractaaiClassification>;
