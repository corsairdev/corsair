import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

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
const STRIPE_TOKEN_URL = 'https://api.stripe.com/v1/oauth/token';

async function refreshStripeAccessToken(
	clientSecret: string,
	refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
	// Stripe Apps OAuth uses HTTP Basic Auth with the secret key as username, empty password
	const credentials = Buffer.from(`${clientSecret}:`).toString('base64');

	const response = await fetch(STRIPE_TOKEN_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${credentials}`,
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new StripeAPIError(`Failed to refresh access token: ${error}`);
	}

	const json = (await response.json()) as {
		access_token: string;
		refresh_token: string;
		expires_in: number;
	};
	return {
		accessToken: json.access_token,
		refreshToken: json.refresh_token,
		expiresIn: json.expires_in,
	};
}

/**
 * Returns the stored access token if it has more than 5 minutes left.
 * Stripe Apps OAuth access tokens expire after 1 hour; refresh tokens are
 * reissued on every refresh (resetting the 1-year clock).
 */
export async function getValidStripeAccessToken({
	accessToken,
	expiresAt,
	clientSecret,
	refreshToken,
	forceRefresh = false,
}: {
	clientSecret: string;
	accessToken?: string | null;
	expiresAt?: string | null;
	refreshToken: string;
	forceRefresh?: boolean;
}): Promise<{
	accessToken: string;
	refreshToken: string;
	expiresAt: number;
	refreshed: boolean;
}> {
	const now = Math.floor(Date.now() / 1000);
	const bufferSeconds = 5 * 60;

	if (
		!forceRefresh &&
		accessToken &&
		expiresAt &&
		Number(expiresAt) > now + bufferSeconds
	) {
		return {
			accessToken,
			refreshToken,
			expiresAt: Number(expiresAt),
			refreshed: false,
		};
	}

	const tokenData = await refreshStripeAccessToken(clientSecret, refreshToken);
	return {
		accessToken: tokenData.accessToken,
		refreshToken: tokenData.refreshToken,
		expiresAt: now + tokenData.expiresIn,
		refreshed: true,
	};
}

/**
 * Recursively encodes an object as application/x-www-form-urlencoded.
 * Stripe uses bracket notation for nested objects: card[number]=4242...
 * The request utility's getRequestBody JSON-stringifies plain objects even with
 * x-www-form-urlencoded mediaType, so we pre-encode to a string here.
 */
// unknown: values can be primitives, arrays, or nested objects; narrowed below via typeof/Array.isArray guards
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
			// Type assertion is safe because we know value is an object
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
			// Type assertion: ApiError exposes no typed body property; asserting to access Stripe's error envelope fields
			const apiErr = error as {
				body?: { error?: { message?: string; code?: string } };
			};
			const stripeMsg = apiErr.body?.error?.message;
			const stripeCode = apiErr.body?.error?.code;
			throw new StripeAPIError(stripeMsg ?? error.message, stripeCode);
		}
		throw new StripeAPIError('Unknown error');
	}
}
