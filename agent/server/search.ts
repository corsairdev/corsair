import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';
import { codeExamples, db } from './db';

// ─────────────────────────────────────────────────────────────────────────────
// Search for relevant code examples using embeddings
// ─────────────────────────────────────────────────────────────────────────────

export interface CodeExampleResult {
	id: string;
	description: string;
	code: string;
	similarity: number;
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
	if (a.length !== b.length) {
		throw new Error('Vectors must have the same length');
	}

	let dotProduct = 0;
	let normA = 0;
	let normB = 0;

	for (let i = 0; i < a.length; i++) {
		dotProduct += a[i] * b[i];
		normA += a[i] * a[i];
		normB += b[i] * b[i];
	}

	return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Search for code examples similar to the given query
 * @param query - The search query (user prompt)
 * @param limit - Maximum number of results to return (default: 5)
 * @returns Array of code examples sorted by similarity
 */
export async function searchCodeExamples(
	query: string,
	limit = 5,
): Promise<CodeExampleResult[]> {
	console.log(
		'[search] Searching for code examples, query length:',
		query.length,
	);

	// Check if we have OpenAI API key
	if (!process.env.OPENAI_API_KEY) {
		console.warn('[search] No OPENAI_API_KEY, returning empty results');
		return [];
	}

	try {
		// Generate embedding for the query
		const embeddingModel = openai.embedding('text-embedding-3-small');
		const { embedding } = await embed({
			model: embeddingModel,
			value: query,
		});

		console.log(
			`[search] Generated query embedding with ${embedding.length} dimensions`,
		);

		// Fetch all code examples
		const allExamples = await db.select().from(codeExamples);

		console.log(`[search] Found ${allExamples.length} examples in database`);

		// Calculate similarity for each example
		const resultsWithSimilarity = allExamples
			.map((example) => {
				const exampleVector = example.vector as number[];
				const similarity = cosineSimilarity(embedding, exampleVector);
				return {
					id: example.id,
					description: example.description,
					code: example.code,
					similarity,
				};
			})
			.sort((a, b) => b.similarity - a.similarity)
			.slice(0, limit);

		console.log(
			`[search] Returning ${resultsWithSimilarity.length} most similar examples`,
		);

		return resultsWithSimilarity;
	} catch (error) {
		console.error('[search] Error searching code examples:', error);
		// Fall back to returning all examples if embedding fails
		console.log('[search] Falling back to returning all examples');

		const results = await db
			.select({
				id: codeExamples.id,
				description: codeExamples.description,
				code: codeExamples.code,
			})
			.from(codeExamples)
			.limit(limit);

		return results.map((r) => ({
			id: r.id,
			description: r.description,
			code: r.code,
			similarity: 0.5, // Default similarity for fallback
		}));
	}
}
