import { z } from 'zod';
import { llm } from './index.js';
import type { OperationInfo } from '../commands/list.js';

const SimilarOperationSchema = z.object({
	name: z.string(),
	fileName: z.string(),
	reason: z.string(),
});

const SimilarityCheckResponseSchema = z.object({
	hasSimilar: z.boolean(),
	similarOperations: z.array(SimilarOperationSchema),
});

export type SimilarityCheckResponse = z.infer<
	typeof SimilarityCheckResponseSchema
>;

export async function checkSimilarity(
	newOperationName: string,
	newInstructions: string,
	existingOperations: OperationInfo[],
	operationType: 'query' | 'mutation',
): Promise<SimilarityCheckResponse | null> {
	if (existingOperations.length === 0) {
		return { hasSimilar: false, similarOperations: [] };
	}

	const operationsContext = existingOperations
		.map((op) => {
			const parts = [
				`Name: ${op.name}`,
				`FileName: ${op.fileName}`,
				op.userInstructions
					? `User Instructions: ${op.userInstructions}`
					: null,
				op.input ? `Input: ${op.input}` : null,
				op.output ? `Output: ${op.output}` : null,
				op.pseudoCode && op.pseudoCode.length > 0
					? `Pseudo Code:\n${op.pseudoCode.join('\n')}`
					: null,
			];
			return parts.filter(Boolean).join('\n');
		})
		.join('\n\n---\n\n');

	const prompt = `You are analyzing database operations (${operationType}s) to detect very similar functionality.

Your task is to identify if any existing operations are nearly identical to the new operation being created.

STRICT CRITERIA FOR SIMILARITY:
- Operations should target the same database tables
- Operations should have the same core purpose/functionality
- Minor differences in filters, ordering, or output format still count as similar
- Different purposes (e.g., "get all posts" vs "get posts by author") are NOT similar

Only flag operations as similar if they would likely cause confusion or duplication in the codebase.

NEW OPERATION:
Name: ${newOperationName}
Instructions: ${newInstructions}

EXISTING OPERATIONS:
${operationsContext}

Analyze whether any existing operations are very similar to the new operation.
For each similar operation, provide the exact name, fileName, and a clear reason explaining why they are similar.`;

	const message = `Analyze similarity between the new ${operationType} and existing ${operationType}s.`;

	return llm({
		provider: 'openai',
		prompt,
		schema: SimilarityCheckResponseSchema,
		message,
	});
}

