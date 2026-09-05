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

type CampaignCleanerRequestOptions = {
	method?: 'GET' | 'POST' | 'DELETE';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	responseType?: 'json' | 'arrayBuffer';
};

export async function makeCampaignCleanerRequest<T>(
	endpoint: string,
	apiKey: string,
	options: CampaignCleanerRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, responseType = 'json' } = options;

	if (responseType === 'arrayBuffer') {
		return makeCampaignCleanerBinaryRequest<T>(
			endpoint,
			apiKey,
			method,
			body,
			query,
		);
	}

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
		throw normalizeCampaignCleanerError(error);
	}
}

async function makeCampaignCleanerBinaryRequest<T>(
	endpoint: string,
	apiKey: string,
	method: 'GET' | 'POST' | 'DELETE',
	body?: Record<string, unknown>,
	query?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
	const url = new URL(`${CAMPAIGNCLEANER_API_BASE}/${endpoint}`);

	if (query) {
		for (const [key, value] of Object.entries(query)) {
			if (value !== undefined) {
				url.searchParams.set(key, String(value));
			}
		}
	}

	try {
		const response = await fetch(url, {
			method,
			headers: {
				'Content-Type': 'application/json',
				'X-CC-API-Key': apiKey,
			},
			body: method === 'POST' ? JSON.stringify(body) : undefined,
			credentials: 'omit',
			redirect: 'error',
		});

		if (!response.ok) {
			const retryAfterHeader = response.headers.get('Retry-After');

			const retryAfter = retryAfterHeader
				? Number(retryAfterHeader)
				: undefined;

			let message = `Campaign Cleaner API request failed with status ${response.status}`;

			const contentType = response.headers.get('Content-Type') ?? '';

			if (contentType.toLowerCase().includes('application/json')) {
				try {
					const errorBody = (await response.json()) as {
						message?: string;
						error?: string;
						detail?: string;
					};

					message =
						errorBody.message ?? errorBody.error ?? errorBody.detail ?? message;
				} catch {
					// Keep the status-based error message.
				}
			}

			throw new CampaignCleanerAPIError(
				message,
				response.status,
				Number.isNaN(retryAfter) ? undefined : retryAfter,
			);
		}

		const contentType = response.headers.get('Content-Type') ?? '';

		if (!contentType.toLowerCase().startsWith('application/pdf')) {
			throw new CampaignCleanerAPIError(
				`Expected application/pdf response but received ${
					contentType || 'unknown content type'
				}`,
				response.status,
			);
		}

		return (await response.arrayBuffer()) as T;
	} catch (error) {
		throw normalizeCampaignCleanerError(error);
	}
}

function normalizeCampaignCleanerError(
	error: unknown,
): CampaignCleanerAPIError {
	if (error instanceof CampaignCleanerAPIError) {
		return error;
	}

	if (error instanceof ApiError) {
		return new CampaignCleanerAPIError(
			error.message,
			error.status,
			error.retryAfter,
		);
	}

	if (error instanceof Error) {
		return new CampaignCleanerAPIError(error.message);
	}

	return new CampaignCleanerAPIError('Unknown error');
}
