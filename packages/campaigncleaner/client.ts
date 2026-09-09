import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

const CAMPAIGNCLEANER_API_BASE = 'https://api.campaigncleaner.com';
const REQUEST_TIMEOUT_MS = 20_000;

export class CampaignCleanerAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'CampaignCleanerAPIError';
	}
}

type CampaignCleanerRequestOptions = {
	method?: 'GET' | 'POST';
	body?: Record<string, unknown>;
	binary?: boolean;
};

function config(apiKey: string): OpenAPIConfig {
	return {
		BASE: CAMPAIGNCLEANER_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		TIMEOUT: REQUEST_TIMEOUT_MS,
		HEADERS: {
			'Content-Type': 'application/json',
			'X-CC-API-Key': apiKey,
		},
	};
}

function errorMessageFromBody(body: unknown, fallback: string): string {
	if (typeof body !== 'object' || body === null) return fallback;
	const obj = body as { error?: unknown; message?: unknown; detail?: unknown };
	if (typeof obj.error === 'string' && obj.error.length > 0) return obj.error;
	if (typeof obj.message === 'string' && obj.message.length > 0) {
		return obj.message;
	}
	if (typeof obj.detail === 'string' && obj.detail.length > 0)
		return obj.detail;
	return fallback;
}

function parseRetryAfterMs(header: string | null): number | undefined {
	if (!header) return undefined;
	const seconds = Number(header);
	if (!Number.isNaN(seconds)) return seconds * 1000;
	return undefined;
}

export async function makeCampaignCleanerRequest<T>(
	endpoint: string,
	apiKey: string,
	options: CampaignCleanerRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, binary = false } = options;

	if (binary) {
		return makeCampaignCleanerBinaryRequest<T>(endpoint, apiKey, method, body);
	}

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' ? body : undefined,
		mediaType: 'application/json',
	};

	try {
		return await request<T>(config(apiKey), requestOptions);
	} catch (error) {
		throw normalizeCampaignCleanerError(error);
	}
}

async function makeCampaignCleanerBinaryRequest<T>(
	endpoint: string,
	apiKey: string,
	method: 'GET' | 'POST',
	body?: Record<string, unknown>,
): Promise<T> {
	const path = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
	const url = `${CAMPAIGNCLEANER_API_BASE}/${path}`;

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
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});

		if (!response.ok) {
			const retryAfter = parseRetryAfterMs(response.headers.get('Retry-After'));
			let parsed: unknown;
			const contentType = response.headers.get('Content-Type') ?? '';
			if (contentType.toLowerCase().includes('application/json')) {
				try {
					parsed = await response.json();
				} catch {
					parsed = undefined;
				}
			}
			throw new CampaignCleanerAPIError(
				errorMessageFromBody(
					parsed,
					`Campaign Cleaner API request failed with status ${response.status}`,
				),
				response.status,
				retryAfter,
				parsed,
			);
		}

		const bytes = Buffer.from(await response.arrayBuffer());
		const contentType =
			response.headers.get('Content-Type') ?? 'application/pdf';
		if (
			!contentType.toLowerCase().includes('application/pdf') &&
			bytes.subarray(0, 4).toString() !== '%PDF'
		) {
			throw new CampaignCleanerAPIError(
				`Expected application/pdf response but received ${contentType}`,
				response.status,
			);
		}

		return {
			content_type: contentType,
			content_base64: bytes.toString('base64'),
		} as T;
	} catch (error) {
		throw normalizeCampaignCleanerError(error);
	}
}

function normalizeCampaignCleanerError(
	error: unknown,
): CampaignCleanerAPIError {
	if (error instanceof CampaignCleanerAPIError) return error;
	if (error instanceof ApiError) {
		return new CampaignCleanerAPIError(
			errorMessageFromBody(error.body, error.message),
			error.status,
			error.retryAfter,
			error.body,
		);
	}
	if (error instanceof Error) return new CampaignCleanerAPIError(error.message);
	return new CampaignCleanerAPIError('Unknown error');
}
