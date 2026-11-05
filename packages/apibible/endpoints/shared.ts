import type { ApiBibleQuery } from '../client';

/**
 * Maps the camelCase `include*` content display options of an endpoint input to
 * the kebab-case query parameters API.Bible expects (`include-notes`,
 * `include-titles`, `include-chapter-numbers`, `include-verse-numbers`,
 * `include-verse-spans`). Only boolean options that are present get sent.
 */
export function buildContentQuery(
	// Accepts only the `include*` option keys of an endpoint input; the full input is
	// provider-specific per endpoint, so it is intentionally kept as an unknown record.
	input: Record<string, unknown>,
): ApiBibleQuery {
	const query: ApiBibleQuery = {};

	for (const key of [
		'includeNotes',
		'includeTitles',
		'includeChapterNumbers',
		'includeVerseNumbers',
		'includeVerseSpans',
	] as const) {
		const value = input[key];
		if (typeof value === 'boolean') {
			query[kebabCase(key)] = value;
		}
	}

	return query;
}

function kebabCase(value: string): string {
	return value.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}
