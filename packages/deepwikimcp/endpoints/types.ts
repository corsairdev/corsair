import { z } from 'zod';

const RepoNameSchema = z
	.string()
	.regex(/^[^/\s]+\/[^/\s]+$/, 'Expected owner/repo');

const ToolContentSchema = z
	.object({
		type: z.string(),
		text: z.string().optional(),
		image: z.string().optional(),
		mimeType: z.string().optional(),
	})
	.loose();

const ToolResponseSchema = z
	.object({
		content: z.array(ToolContentSchema),
		isError: z.boolean().optional(),
	})
	.loose();

const AskQuestionInputSchema = z.object({
	repoName: z.union([RepoNameSchema, z.array(RepoNameSchema).min(1).max(10)]),
	question: z.string().min(1),
});

export type AskQuestionInput = z.infer<typeof AskQuestionInputSchema>;

const ReadWikiContentsInputSchema = z.object({ repoName: RepoNameSchema });
export type ReadWikiContentsInput = z.infer<typeof ReadWikiContentsInputSchema>;

const ReadWikiStructureInputSchema = z.object({ repoName: RepoNameSchema });
export type ReadWikiStructureInput = z.infer<
	typeof ReadWikiStructureInputSchema
>;

export type DeepwikiMcpToolResponse = z.infer<typeof ToolResponseSchema>;

export type DeepwikiMcpEndpointInputs = {
	askQuestion: AskQuestionInput;
	readWikiContents: ReadWikiContentsInput;
	readWikiStructure: ReadWikiStructureInput;
};

export type DeepwikiMcpEndpointOutputs = {
	askQuestion: DeepwikiMcpToolResponse;
	readWikiContents: DeepwikiMcpToolResponse;
	readWikiStructure: DeepwikiMcpToolResponse;
};

export const DeepwikiMcpEndpointInputSchemas = {
	askQuestion: AskQuestionInputSchema,
	readWikiContents: ReadWikiContentsInputSchema,
	readWikiStructure: ReadWikiStructureInputSchema,
} as const;

export const DeepwikiMcpEndpointOutputSchemas = {
	askQuestion: ToolResponseSchema,
	readWikiContents: ToolResponseSchema,
	readWikiStructure: ToolResponseSchema,
} as const;
