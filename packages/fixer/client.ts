import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class FixerAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: number | string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'FixerAPIError';
	}
}

const FIXER_API_BASE = 'https://data.fixer.io/api';

export async function makeFixerRequest<T>(
	endpoint: string,
	accessKey: string,
	options: {
		method?: 'GET' | 'POST';
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', query = {} } = options;
	const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

	const config: OpenAPIConfig = {
		BASE: FIXER_API_BASE,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const fullQuery = {
		access_key: accessKey,
		...query,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: cleanEndpoint,
		query: fullQuery,
	};

	try {
		const res = await request<
			T & { success?: boolean; error?: { code: number; info: string } }
		>(config, requestOptions);

		if (res && res.success === false && res.error) {
			throw new FixerAPIError(
				res.error.info || 'Fixer API error',
				res.error.code,
			);
		}

		return res;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof FixerAPIError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new FixerAPIError(error.message);
		}
		throw new FixerAPIError('Unknown Fixer API error');
	}
}
