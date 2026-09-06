import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class WriterAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'WriterAPIError';
	}
}

const WRITER_API_BASE = 'https://api.writer.com/v1';

export async function makeWriterRequest<T>(
	endpoint: string,
	apiKey: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
	body?: Record<string, unknown>,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: WRITER_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method !== 'GET' ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query:
			method === 'GET'
				? (body as
						| Record<string, string | number | boolean | undefined>
						| undefined)
				: undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw new WriterAPIError(error.message);
		}
		throw new WriterAPIError('Unknown Writer API error');
	}
}
