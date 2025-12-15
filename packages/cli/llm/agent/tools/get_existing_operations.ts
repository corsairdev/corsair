import { tool } from 'ai';
import { promises as fs } from 'fs';
import path from 'path';
import z from 'zod';

type OperationDirs = {
	queriesDir: string;
	mutationsDir: string;
};

const opTypeSchema = z.enum(['query', 'mutation']);

/**
 * Normalizes a string for fuzzy matching by:
 * - Converting to lowercase
 * - Removing extra repeated characters (e.g., "timessssss" -> "times")
 * - Removing hyphens and spaces
 */
function normalizeForMatching(text: string): string {
	let normalized = text.toLowerCase().replace(/-/g, '').replace(/\s+/g, '');
	
	// Replace sequences of 3+ repeated characters with a single character
	// Use a loop to handle multiple passes until no more changes occur
	let previous: string;
	do {
		previous = normalized;
		normalized = normalized.replace(/(.)\1{2,}/g, '$1');
	} while (normalized !== previous);
	
	return normalized;
}

/**
 * Checks if two normalized strings match with fuzzy logic.
 * Returns true if the normalized filter is contained in the normalized filename,
 * or if they share significant word overlap.
 */
function fuzzyMatch(filter: string, filename: string): boolean {
	const normalizedFilter = normalizeForMatching(filter);
	const normalizedFilename = normalizeForMatching(filename);

	// Direct substring match after normalization
	if (normalizedFilename.includes(normalizedFilter)) {
		return true;
	}

	// Reverse check - if filename is contained in filter (handles cases where filter has extra chars)
	if (normalizedFilter.includes(normalizedFilename)) {
		return true;
	}

	// Extract key words (sequences of letters) and check overlap
	const filterWords = normalizedFilter.match(/[a-z]+/g) || [];
	const filenameWords = normalizedFilename.match(/[a-z]+/g) || [];

	if (filterWords.length === 0 || filenameWords.length === 0) {
		return false;
	}

	// Check if most filter words appear in filename (at least 70% match)
	const matchingWords = filterWords.filter((word) =>
		filenameWords.some((fw) => fw.includes(word) || word.includes(fw)),
	);

	return matchingWords.length / filterWords.length >= 0.7;
}

export const getExistingOperations = (dirs: OperationDirs) =>
	tool({
		description:
			'Return the list of existing operation files for the given type. Optionally filter by fuzzy substring matching (handles variations like extra characters). IMPORTANT: If this returns any results, you MUST read those files using read_file before deciding whether to create a new operation or update an existing one. Operations with similar names (differing only by typos or extra characters) should be considered for reuse.',
		inputSchema: z.object({
			operationType: opTypeSchema,
			filter: z.string().optional(),
		}),
		execute: async ({ operationType, filter }) => {
			const targetDir =
				operationType === 'query' ? dirs.queriesDir : dirs.mutationsDir;
			const resolvedDir = path.resolve(process.cwd(), targetDir);

			try {
				const entries = await fs.readdir(resolvedDir, { withFileTypes: true });

				const files = entries
					.filter(
						(entry) =>
							entry.isFile() &&
							entry.name.toLowerCase().endsWith('.ts') &&
							entry.name !== 'index.ts',
					)
					.map((entry) => ({
						name: entry.name.replace(/\.ts$/i, ''),
						relativePath: path.join(targetDir, entry.name),
					}));

				if (!filter) {
					return files.map((f) => f.relativePath);
				}

				const filterText = filter.trim();
				const matches = files.filter((file) =>
					fuzzyMatch(filterText, file.name),
				);
console.log(matches)
				return matches.map((f) => f.relativePath);
			} catch (error: any) {
				if (error && typeof error === 'object' && error.code === 'ENOENT') {
					return [];
				}

				throw error;
			}
		},
	});
