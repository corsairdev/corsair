import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class BetterProposalsAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'BetterProposalsAPIError';
	}
}

export class BetterProposalsRateLimitError extends BetterProposalsAPIError {
	constructor(
		message = 'Too Many Requests',
		public readonly retryAfterMs?: number,
		body?: unknown,
	) {
		super(message, '429', 429, body);
		this.name = 'BetterProposalsRateLimitError';
	}
}

const BETTERPROPOSALS_API_BASE = 'https://api.betterproposals.io';

/**
 * Encodes an object as application/x-www-form-urlencoded matching PHP http_build_query format.
 */
export function toFormEncoded(
	params: Record<string, unknown>,
	prefix?: string,
): string {
	const parts: string[] = [];
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null) continue;
		const fullKey = prefix ? `${prefix}[${key}]` : key;
		if (Array.isArray(value)) {
			for (let i = 0; i < value.length; i++) {
				const item = value[i];
				if (item !== null && typeof item === 'object') {
					const nested = toFormEncoded(
						item as Record<string, unknown>,
						`${fullKey}[${i}]`,
					);
					if (nested) parts.push(nested);
				} else if (item !== undefined && item !== null) {
					parts.push(
						`${encodeURIComponent(`${fullKey}[${i}]`)}=${encodeURIComponent(String(item))}`,
					);
				}
			}
		} else if (typeof value === 'object') {
			const nested = toFormEncoded(value as Record<string, unknown>, fullKey);
			if (nested) parts.push(nested);
		} else {
			parts.push(
				`${encodeURIComponent(fullKey)}=${encodeURIComponent(String(value))}`,
			);
		}
	}
	return parts.join('&');
}

export async function makeBetterProposalsRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	// Bptoken authentication header is required by Better Proposals.
	// Note: TOKEN is omitted to prevent setting Authorization: Bearer.
	const config: OpenAPIConfig = {
		BASE: BETTERPROPOSALS_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Bptoken: apiKey,
		},
	};

	const isWriteMethod =
		method === 'POST' || method === 'PUT' || method === 'PATCH';
	const hasBody = isWriteMethod && body !== undefined;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
		body: hasBody ? toFormEncoded(body) : undefined,
		mediaType: hasBody ? 'application/x-www-form-urlencoded' : undefined,
		query: !isWriteMethod ? query : undefined,
	};

	try {
		const response = await request<T>(config, requestOptions);

		// Handle API-level error envelopes if returned with 200 OK
		if (
			response &&
			typeof response === 'object' &&
			'status' in response &&
			(response as { status: unknown }).status === 'error'
		) {
			const errObj = response as { status: string; message?: string };
			throw new BetterProposalsAPIError(
				errObj.message || 'Better Proposals API error',
				errObj.status,
				200,
				response,
			);
		}

		return response;
	} catch (error: unknown) {
		if (error instanceof BetterProposalsAPIError) {
			throw error;
		}

		if (error instanceof ApiError) {
			const msg =
				typeof error.body === 'object' && error.body && 'message' in error.body
					? String((error.body as { message: unknown }).message)
					: error.message;

			if (error.status === 429) {
				throw new BetterProposalsRateLimitError(
					msg || error.message,
					error.retryAfter,
					error.body,
				);
			}

			throw new BetterProposalsAPIError(
				msg || error.message,
				undefined,
				error.status,
				error.body,
			);
		}

		if (error instanceof Error) {
			throw new BetterProposalsAPIError(error.message);
		}

		throw new BetterProposalsAPIError('Unknown error');
	}
}
