import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class MerriamWebsterDictAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'MerriamWebsterDictAPIError';
	}
}

/**
 * Official URL path codes for dictionary products.
 * https://www.dictionaryapi.com/api/v3/references/{reference}/json/{word}
 */
export const MERRIAMWEBSTERDICT_REFERENCES = [
	'collegiate',
	'sd2',
	'sd3',
	'sd4',
] as const;
export type MerriamWebsterDictReference =
	(typeof MERRIAMWEBSTERDICT_REFERENCES)[number];

export const DEFAULT_MERRIAMWEBSTERDICT_REFERENCE: MerriamWebsterDictReference =
	'collegiate';

function isMerriamWebsterDictReference(
	value: string,
): value is MerriamWebsterDictReference {
	return (MERRIAMWEBSTERDICT_REFERENCES as readonly string[]).includes(value);
}

function buildConfig(reference: MerriamWebsterDictReference): OpenAPIConfig {
	return {
		BASE: `https://www.dictionaryapi.com/api/v3/references/${reference}/json`,
		VERSION: '3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {},
	};
}

export function resolveMerriamWebsterDictReference(
	value: string | undefined,
): MerriamWebsterDictReference {
	if (value === undefined) {
		return DEFAULT_MERRIAMWEBSTERDICT_REFERENCE;
	}
	if (!isMerriamWebsterDictReference(value)) {
		throw new MerriamWebsterDictAPIError(
			`Unknown Merriam-Webster reference "${value}". Use collegiate, sd2, sd3, or sd4.`,
		);
	}
	return value;
}

/**
 * GET /api/v3/references/{reference}/json/{word}?key=
 *
 * Merriam-Webster always responds with HTTP 200. Errors are body-shaped:
 * - Invalid / unsubscribed key: a plain-text string (not JSON).
 * - Unknown word: a JSON array of suggestion strings.
 */
export async function lookupWord(
	word: string,
	apiKey: string,
	reference: string = DEFAULT_MERRIAMWEBSTERDICT_REFERENCE,
): Promise<unknown> {
	const resolved = resolveMerriamWebsterDictReference(reference);
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: `/${encodeURIComponent(word)}`,
		mediaType: 'application/json; charset=utf-8',
		query: { key: apiKey },
	};

	let body: unknown;
	try {
		body = await request<unknown>(buildConfig(resolved), requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new MerriamWebsterDictAPIError(error.message);
		}
		throw new MerriamWebsterDictAPIError('Unknown error');
	}

	if (typeof body === 'string') {
		throw new MerriamWebsterDictAPIError(body);
	}

	return body;
}

/**
 * Pronunciation audio URL from official `sound.audio`.
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

/** Official `et` is `[["text", "..."], ...]`. */
export function etymologyTexts(et: unknown): string[] {
	if (!Array.isArray(et)) {
		return [];
	}
	const texts: string[] = [];
	for (const item of et) {
		if (
			Array.isArray(item) &&
			item[0] === 'text' &&
			typeof item[1] === 'string'
		) {
			texts.push(item[1]);
		}
	}
	return texts;
}
