import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class WaboxappAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'WaboxappAPIError';
	}
}

export const WABOXAPP_API_BASE = 'https://www.waboxapp.com/api';

export async function makeWaboxappRequest<T>(
	endpoint: string,
	options: {
		method?: 'GET' | 'POST';
		fields: Record<string, string | number | boolean | undefined>;
	},
): Promise<T> {
	const { method = 'POST', fields } = options;
	const form: Record<string, string> = {};
	for (const [key, value] of Object.entries(fields)) {
		if (value === undefined) continue;
		form[key] = String(value);
	}

	const config: OpenAPIConfig = {
		BASE: WABOXAPP_API_BASE,
		VERSION: '3.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' ? form : undefined,
		mediaType:
			method === 'POST' ? 'application/x-www-form-urlencoded' : undefined,
		query: method === 'GET' ? form : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new WaboxappAPIError(error.message);
		}
		throw new WaboxappAPIError('Unknown error');
	}
}
