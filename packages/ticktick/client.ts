import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { z } from 'zod';

export class TickTickAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		// milliseconds; carried over from ApiError so the rate-limit handler can
		// honor the provider's Retry-After instead of Corsair's default delay
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'TickTickAPIError';
	}
}

const TICKTICK_API_BASE = 'https://api.ticktick.com/open/v1';
const TICKTICK_TOKEN_URL = 'https://ticktick.com/oauth/token';

const TokenResponseSchema = z.object({
	access_token: z.string().min(1),
	expires_in: z.coerce.number().finite().positive(),
	token_type: z.string().optional(),
	refresh_token: z.string().optional(),
});

const REFRESH_RATE_LIMIT_ATTEMPTS = 6;
const REFRESH_RATE_LIMIT_DEFAULT_MS = 1000;

function retryAfterMsFromResponse(response: Response): number | undefined {
	const retryAfter = response.headers.get('retry-after');
	if (!retryAfter) return undefined;
	const seconds = Number.parseInt(retryAfter, 10);
	if (!Number.isFinite(seconds) || seconds < 0) return undefined;
	return seconds * 1000;
}

async function refreshAccessToken(
	clientId: string,
	clientSecret: string,
	refreshToken: string,
) {
	let lastError: TickTickAPIError | undefined;
	for (let attempt = 0; attempt < REFRESH_RATE_LIMIT_ATTEMPTS; attempt++) {
		const response = await fetch(TICKTICK_TOKEN_URL, {
			method: 'POST',
			signal: AbortSignal.timeout(20_000),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				grant_type: 'refresh_token',
				refresh_token: refreshToken,
				client_id: clientId,
				client_secret: clientSecret,
			}),
		});

		if (response.ok) {
			const parsed = TokenResponseSchema.safeParse(await response.json());
			if (!parsed.success) {
				throw new TickTickAPIError(
					'Failed to refresh access token: invalid token response',
					'INVALID_TOKEN_RESPONSE',
				);
			}
			return parsed.data;
		}

		const error = await response.text();
		const retryAfter = retryAfterMsFromResponse(response);
		lastError = new TickTickAPIError(
			`Failed to refresh access token: ${error}`,
			String(response.status),
			retryAfter,
		);
		if (response.status === 429 && attempt < REFRESH_RATE_LIMIT_ATTEMPTS - 1) {
			await new Promise((resolve) =>
				setTimeout(resolve, retryAfter ?? REFRESH_RATE_LIMIT_DEFAULT_MS),
			);
			continue;
		}
		throw lastError;
	}
	throw lastError ?? new TickTickAPIError('Failed to refresh access token');
}

export async function getValidAccessToken({
	accessToken,
	expiresAt,
	clientId,
	clientSecret,
	refreshToken,
	forceRefresh = false,
}: {
	clientId: string;
	clientSecret: string;
	accessToken?: string | null;
	expiresAt?: string | null;
	refreshToken: string;
	forceRefresh?: boolean;
}): Promise<{
	accessToken: string;
	expiresAt: number;
	refreshed: boolean;
	newRefreshToken?: string;
}> {
	const now = Math.floor(Date.now() / 1000);
	const bufferSeconds = 5 * 60;

	if (
		!forceRefresh &&
		accessToken &&
		expiresAt &&
		Number(expiresAt) > now + bufferSeconds
	) {
		return { accessToken, expiresAt: Number(expiresAt), refreshed: false };
	}

	const tokenData = await refreshAccessToken(
		clientId,
		clientSecret,
		refreshToken,
	);
	return {
		accessToken: tokenData.access_token,
		expiresAt: now + tokenData.expires_in,
		refreshed: true,
		// TickTick does not document refresh-token rotation; persist the new token
		// only when the server actually returns one
		newRefreshToken: tokenData.refresh_token,
	};
}

function extractTickTickError(error: ApiError): string {
	// ApiError.body is typed as any upstream; treat it as unknown and narrow
	// conditionally instead of asserting a shape
	const body: unknown = error.body;
	if (!body) return `[${error.status}] ${error.message}`;

	if (typeof body === 'string') {
		const preview = body.length > 300 ? `${body.slice(0, 300)}...` : body;
		return `[${error.status}] ${preview}`;
	}

	if (
		typeof body === 'object' &&
		'error' in body &&
		typeof body.error === 'string'
	) {
		return `[${error.status}] ${body.error}`;
	}

	if (
		typeof body === 'object' &&
		'errorMessage' in body &&
		typeof body.errorMessage === 'string'
	) {
		return `[${error.status}] ${body.errorMessage}`;
	}

	try {
		return `[${error.status}] ${JSON.stringify(body)}`;
	} catch {
		return `[${error.status}] ${error.message}`;
	}
}

export async function makeTickTickRequest<T>(
	endpoint: string,
	accessToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown> | string;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: TICKTICK_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: accessToken,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		// Already carrying provider status/retryAfter metadata; re-wrapping
		// would strip it
		if (error instanceof TickTickAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			throw new TickTickAPIError(
				extractTickTickError(error),
				String(error.status),
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new TickTickAPIError(error.message);
		}
		throw new TickTickAPIError('Unknown error');
	}
}

function isUnauthorizedError(error: unknown): boolean {
	// makeTickTickRequest wraps every failure in TickTickAPIError, so the code
	// field is authoritative here
	return error instanceof TickTickAPIError && error.code === '401';
}

export async function makeAuthenticatedTickTickRequest<T>(
	endpoint: string,
	ctx: { key: string; _refreshAuth?: () => Promise<string> },
	options: Parameters<typeof makeTickTickRequest>[2] = {},
): Promise<T> {
	try {
		return await makeTickTickRequest<T>(endpoint, ctx.key, options);
	} catch (error) {
		if (isUnauthorizedError(error) && ctx._refreshAuth) {
			const freshToken = await ctx._refreshAuth();
			return await makeTickTickRequest<T>(endpoint, freshToken, options);
		}
		throw error;
	}
}
