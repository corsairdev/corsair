import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class CampaignCleanerAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'CampaignCleanerAPIError';
		Object.setPrototypeOf(this, CampaignCleanerAPIError.prototype);
	}
}

const CAMPAIGNCLEANER_API_BASE = 'https://api.campaigncleaner.com';

export async function makeCampaignCleanerRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'DELETE';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: CAMPAIGNCLEANER_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			'X-CC-API-Key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' ? body : undefined,
		mediaType: 'application/json',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new CampaignCleanerAPIError(
				error.message,
				error.status,
				error.retryAfter,
			);
		}

		if (error instanceof CampaignCleanerAPIError) {
			throw error;
		}

		if (error instanceof Error) {
			throw new CampaignCleanerAPIError(error.message);
		}

		throw new CampaignCleanerAPIError('Unknown error');
	}
}
