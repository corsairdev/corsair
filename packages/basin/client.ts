import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class BasinAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'BasinAPIError';
	}
}

const BASIN_API_BASE = 'https://usebasin.com/api/v1';

function formatAuthHeader(apiKey: string): string {
	const trimmed = apiKey.trim();
	if (trimmed.startsWith('Token ') || trimmed.startsWith('Bearer ')) {
		return trimmed;
	}
	return `Token ${trimmed}`;
}

export async function makeBasinRequest<T>(
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
		BASE: BASIN_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: formatAuthHeader(apiKey),
		},
	};

	const isWriteMethod =
		method === 'POST' || method === 'PUT' || method === 'PATCH';

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWriteMethod && body !== undefined ? body : undefined,
		mediaType: isWriteMethod ? 'application/json; charset=utf-8' : undefined,
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof BasinAPIError) {
			throw error;
		}
		if (error instanceof Error) {
			const apiErr = error as {
				status?: number;
				body?: { message?: string; error?: string; code?: string };
			};
			const basinMsg =
				apiErr.body?.message || apiErr.body?.error || error.message;
			const basinCode = apiErr.body?.code;
			throw new BasinAPIError(basinMsg, basinCode, apiErr.status);
		}
		throw new BasinAPIError('Unknown error');
	}
}
