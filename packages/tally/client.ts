import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class TallyAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'TallyAPIError';
	}
}

const TALLY_API_BASE = 'https://api.tally.so';

export async function makeTallyRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: TALLY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const isWriteMethod =
		method === 'POST' || method === 'PUT' || method === 'PATCH';

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWriteMethod && body !== undefined ? body : undefined,
		mediaType: isWriteMethod ? 'application/json; charset=utf-8' : undefined,
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			const apiErr = error as {
				body?: { message?: string; code?: string };
			};
			const tallyMsg = apiErr.body?.message;
			const tallyCode = apiErr.body?.code;
			throw new TallyAPIError(tallyMsg ?? error.message, tallyCode);
		}
		throw new TallyAPIError('Unknown error');
	}
}
