import { z } from 'zod';

export const DynapicturesDesign = z.object({
	id: z.string(),
	templateId: z.string().optional(),
	imageUrl: z.string().optional(),
	thumbnailUrl: z.string().optional(),
	width: z.number().optional(),
	height: z.number().optional(),
	createdAt: z.string().optional(),
});
export type DynapicturesDesign = z.infer<typeof DynapicturesDesign>;

export const DynapicturesTemplate = z.object({
	id: z.string(),
	name: z.string(),
	width: z.number().optional(),
	height: z.number().optional(),
	thumbnailUrl: z.string().optional(),
});
export type DynapicturesTemplate = z.infer<typeof DynapicturesTemplate>;
