import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class DictionaryAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'DictionaryAPIError';
	}
}

const DICTIONARY_API_BASE =
	'https://www.dictionaryapi.com/api/v3/references/collegiate/json';

function buildConfig(): OpenAPIConfig {
	return {
		BASE: DICTIONARY_API_BASE,
		VERSION: '3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Merriam-Webster authenticates via a `key` query parameter, not a header.
		TOKEN: undefined,
		HEADERS: {},
	};
}

/**
 * Looks up a word in the Merriam-Webster Collegiate Dictionary.
 *
 * Merriam-Webster always responds with HTTP 200, even for an invalid API key
 * or an unrecognized word — errors only show up in the response body shape:
 * - Invalid key: a plain-text string body (not JSON, not an array).
 * - Unknown word: a JSON array of suggested word strings instead of entries.
 * Neither case can be caught via HTTP status, so the invalid-key case is
 * detected here (word-not-found is left to the caller, since it's not an error).
 */
export async function lookupWord(
	word: string,
	apiKey: string,
): Promise<unknown> {
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: `/${encodeURIComponent(word)}`,
		mediaType: 'application/json; charset=utf-8',
		query: { key: apiKey },
	};

	let body: unknown;
	try {
		body = await request<unknown>(buildConfig(), requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw new DictionaryAPIError(error.message);
		}
		throw new DictionaryAPIError('Unknown error');
	}

	if (typeof body === 'string') {
		throw new DictionaryAPIError(body);
	}

	return body;
}

/**
 * Builds the pronunciation audio URL for a Merriam-Webster sound filename.
 * Subdirectory rule per the official API docs:
 * https://dictionaryapi.com/products/json#sec-2.prs
 */
export function buildAudioUrl(filename: string): string {
	let subdirectory: string;
	if (filename.startsWith('bix')) {
		subdirectory = 'bix';
	} else if (filename.startsWith('gg')) {
		subdirectory = 'gg';
	} else if (/^[^a-zA-Z]/.test(filename)) {
		subdirectory = 'number';
	} else {
		subdirectory = filename[0] as string;
	}
	return `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdirectory}/${filename}.mp3`;
}
