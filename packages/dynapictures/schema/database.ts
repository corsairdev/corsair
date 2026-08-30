import { z } from 'zod';

/** Zod entity schema for Dynapictures design database entity */
export const DynapicturesDesign = z.object({
	/** Unique design entity ID */
	id: z.string(),
	/** Template ID associated with the design */
	templateId: z.string().optional(),
	/** URL of the generated image */
	imageUrl: z.string().optional(),
	/** URL of the image thumbnail */
	thumbnailUrl: z.string().optional(),
	/** Width in pixels */
	width: z.number().optional(),
	/** Height in pixels */
	height: z.number().optional(),
	/** Creation timestamp */
	createdAt: z.string().optional(),
});

/** Database entity type for a Dynapictures design */
export type DynapicturesDesign = z.infer<typeof DynapicturesDesign>;

/** Zod entity schema for Dynapictures template database entity */
export const DynapicturesTemplate = z.object({
	/** Unique template entity ID */
	id: z.string(),
	/** Human-readable template name */
	name: z.string(),
	/** Default template width in pixels */
	width: z.number().optional(),
	/** Default template height in pixels */
	height: z.number().optional(),
	/** URL of the template preview thumbnail */
	thumbnailUrl: z.string().optional(),
});

/** Database entity type for a Dynapictures template */
export type DynapicturesTemplate = z.infer<typeof DynapicturesTemplate>;
