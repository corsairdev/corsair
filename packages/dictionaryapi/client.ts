import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class DictionaryApiAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'DictionaryApiAPIError';
	}
}

export const DICTIONARYAPI_API_BASE =
	'https://www.dictionaryapi.com/api/v3/references/collegiate/json';

function buildConfig(): OpenAPIConfig {
	return {
		BASE: DICTIONARYAPI_API_BASE,
		VERSION: '3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {},
	};
}

export async function getEntry(word: string, apiKey: string): Promise<unknown> {
	if (!apiKey) {
		throw new DictionaryApiAPIError('Merriam-Webster API key is required');
	}

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: `/${encodeURIComponent(word)}`,
		mediaType: 'application/json; charset=utf-8',
		query: {
			key: apiKey,
		},
	};

	let body: unknown;
	try {
		body = await request<unknown>(buildConfig(), requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new DictionaryApiAPIError(error.message);
		}
		throw new DictionaryApiAPIError('Unknown error');
	}

	// Merriam-Webster returns a plain text string on invalid key (e.g. "Invalid API key or not subscribed to this database.")
	if (typeof body === 'string') {
		throw new DictionaryApiAPIError(body);
	}

	return body;
}
