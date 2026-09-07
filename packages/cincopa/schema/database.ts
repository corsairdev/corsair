import { z } from 'zod';

/**
 * Cincopa Gallery database entity.
 * Represents a media gallery in Cincopa.
 */
export const CincopaGallery = z.object({
	id: z.string(),
	fid: z.string(),
	name: z.string(),
	description: z.string().optional(),
	upload_url: z.string().optional(),
	tags: z.string().optional(),
	modified: z.string().optional(),
	syncstatus: z.string().optional(),
});

export type CincopaGallery = z.infer<typeof CincopaGallery>;
