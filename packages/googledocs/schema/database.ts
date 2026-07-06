import { z } from 'zod';

export const GoogleDocsDocument = z.object({
	id: z.string(),
	documentId: z.string().optional(),
	title: z.string().optional(),
	revisionId: z.string().optional(),
	url: z.string().optional(),
	createdTime: z.string().optional(),
	modifiedTime: z.string().optional(),
	wordCount: z.number().optional(),
	headerCount: z.number().optional(),
	footerCount: z.number().optional(),
	footnoteCount: z.number().optional(),
	tableCount: z.number().optional(),
	imageCount: z.number().optional(),
	filePath: z.string().optional(),
	createdAt: z.coerce.date().optional(),
});

export type GoogleDocsDocument = z.infer<typeof GoogleDocsDocument>;
