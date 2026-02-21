import 'dotenv/config';
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';
import { codeExamples, db } from '../db';

import { codeExamples as examples } from './examples';

// ─────────────────────────────────────────────────────────────────────────────
// Seed script to create embeddings and store code examples
// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
	console.log('[seed] Starting seed process...');
	console.log(`[seed] Found ${examples.length} code examples`);

	// Check if we have OpenAI API key
	if (!process.env.OPENAI_API_KEY) {
		throw new Error('OPENAI_API_KEY environment variable is required');
	}

	const embeddingModel = openai.embedding('text-embedding-3-small');

	for (let i = 0; i < examples.length; i++) {
		const example = examples[i];
		console.log(
			`[seed] Processing example ${i + 1}/${examples.length}: ${example.description.substring(0, 50)}...`,
		);

		try {
			// Generate embedding for the description
			const { embedding } = await embed({
				model: embeddingModel,
				value: example.description,
			});

			console.log(
				`[seed] Generated embedding with ${embedding.length} dimensions`,
			);

			// Store in database
			await db.insert(codeExamples).values({
				vector: embedding,
				description: example.description,
				code: example.code,
			});

			console.log(`[seed] Stored example ${i + 1} in database`);
		} catch (error) {
			console.error(`[seed] Error processing example ${i + 1}:`, error);
			throw error;
		}
	}

	console.log('[seed] Seed process completed successfully!');
	process.exit(0);
}

seed().catch((error) => {
	console.error('[seed] Fatal error:', error);
	process.exit(1);
});
