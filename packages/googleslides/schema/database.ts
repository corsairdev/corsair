import { z } from 'zod';

export const GoogleSlidesPresentation = z.object({
	id: z.string(),
	presentationId: z.string().optional(),
	title: z.string().optional(),
	url: z.string().optional(),
	revisionId: z.string().optional(),
	// Counts rather than the full deck: the API reply is large and the counts
	// are what a sync or a listing can compare without downloading every slide.
	slideCount: z.number().optional(),
	layoutCount: z.number().optional(),
	masterCount: z.number().optional(),
	createdTime: z.string().optional(),
	modifiedTime: z.string().optional(),
	lastSyncedAt: z.coerce.date().optional(),
	createdAt: z.coerce.date().optional(),
});

export type GoogleSlidesPresentation = z.infer<typeof GoogleSlidesPresentation>;
