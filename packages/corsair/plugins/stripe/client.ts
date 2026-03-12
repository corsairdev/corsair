import type { ApiRequestOptions } from '../../async-core/ApiRequestOptions';
import type { OpenAPIConfig } from '../../async-core/OpenAPI';
import { request } from '../../async-core/request';

export class StripeAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'StripeAPIError';
	}
}

const STRIPE_API_BASE = 'https://api.stripe.com/v1';

/**
 * Recursively encodes an object as application/x-www-form-urlencoded.
 * Stripe uses bracket notation for nested objects: card[number]=4242...
 * The request utility's getRequestBody JSON-stringifies plain objects even with
 * x-www-form-urlencoded mediaType, so we pre-encode to a string here.
 */
function toFormEncoded(
	params: Record<string, unknown>,
	prefix?: string,
): string {
	const parts: string[] = [];
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null) continue;
		const fullKey = prefix ? `${prefix}[${key}]` : key;
		if (Array.isArray(value)) {
			for (let i = 0; i < value.length; i++) {
				parts.push(
					`${encodeURIComponent(`${fullKey}[${i}]`)}=${encodeURIComponent(String(value[i]))}`,
				);
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

export async function makeStripeRequest<T>(
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
		BASE: STRIPE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// TOKEN drives Authorization: Bearer header; avoids setting Content-Type globally
		TOKEN: apiKey,
	};

	const isWriteMethod =
		method === 'POST' || method === 'PUT' || method === 'PATCH';
	const hasBody = isWriteMethod && body !== undefined;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		// Pre-encode as form string so getRequestBody passes it through as-is
		body: hasBody ? toFormEncoded(body!) : undefined,
		mediaType: hasBody ? 'application/x-www-form-urlencoded' : undefined,
		query: !isWriteMethod ? query : undefined,
	};

	try {
		const response = await request<T>(config, requestOptions);
		return response;
	} catch (error) {
		if (error instanceof Error) {
			// Surface the real Stripe error message and code from the response body
			const apiErr = error as { body?: { error?: { message?: string; code?: string } } };
			const stripeMsg = apiErr.body?.error?.message;
			const stripeCode = apiErr.body?.error?.code;
			throw new StripeAPIError(stripeMsg ?? error.message, stripeCode);
		}
		throw new StripeAPIError('Unknown error');
	}
}
