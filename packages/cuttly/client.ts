import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

const CUTTLY_API_BASE = 'https://cutt.ly';

export class CuttlyAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: number,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'CuttlyAPIError';
	}
}

export async function makeCuttlyRequest<T>(
	apiKey: string,
	query: Record<string, string | number | boolean | undefined>,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: CUTTLY_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
	};
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: '/api/api.php',
		query: { key: apiKey, ...query },
	};
	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new CuttlyAPIError(
				error.message,
				undefined,
				error.status,
				error.retryAfter,
			);
		}
		if (error instanceof Error) throw new CuttlyAPIError(error.message);
		throw new CuttlyAPIError('Unknown Cutt.ly API error');
	}
}
