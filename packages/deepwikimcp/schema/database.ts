import { z } from 'zod';

export const DeepwikiMcpQuestion = z.object({
	repoName: z.union([z.string(), z.array(z.string())]),
	question: z.string(),
	answer: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const DeepwikiMcpWikiContents = z.object({
	repoName: z.string(),
	contents: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const DeepwikiMcpWikiStructure = z.object({
	repoName: z.string(),
	// DeepWiki returns free-form outline entries whose exact shape is
	// provider-defined (plain strings and nested items), hence `unknown`.
	topics: z.array(z.unknown()).optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type DeepwikiMcpQuestion = z.infer<typeof DeepwikiMcpQuestion>;
export type DeepwikiMcpWikiContents = z.infer<typeof DeepwikiMcpWikiContents>;
export type DeepwikiMcpWikiStructure = z.infer<typeof DeepwikiMcpWikiStructure>;
