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
	// Whether the configured trigger placeholder was present at last sight;
	// lets documentPlaceholderFilled fire only on the present -> absent edge.
	hasPlaceholder: z.boolean().optional(),
	// Whether the configured trigger keyword was present at last sight;
	// lets keywordDetected fire only on the absent -> present edge.
	hasKeyword: z.boolean().optional(),
	// Whether the configured searchQuery matched title or body at last sight;
	// lets documentSearchUpdate fire only on the absent -> present edge.
	hasSearchMatch: z.boolean().optional(),
	filePath: z.string().optional(),
	createdAt: z.coerce.date().optional(),
});

export type GoogleDocsDocument = z.infer<typeof GoogleDocsDocument>;
