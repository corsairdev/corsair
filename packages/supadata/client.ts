interface RateLimitConfig {
	enabled: boolean;
	maxRetries: number;
	initialRetryDelay: number;
	backoffMultiplier: number;
	headerNames: {
		retryAfter?: string;
		resetTime?: string;
		remaining?: string;
		limit?: string;
	};
}

/**
 * Rate-limit config for the Supadata API.
 * Supadata uses standard Retry-After headers on HTTP 429 responses.
 */
const SUPADATA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
		resetTime: 'x-ratelimit-reset',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

function extractRetryAfterMs(res: Response): number | undefined {
	const retryAfter =
		res.headers.get('Retry-After') ?? res.headers.get('retry-after');
	if (retryAfter) {
		const seconds = parseInt(retryAfter, 10);
		if (!isNaN(seconds)) {
			return seconds * 1000;
		}
	}
	return undefined;
}

function calculateRetryDelay(attempt: number, retryAfterMs?: number): number {
	if (retryAfterMs !== undefined) {
		return retryAfterMs;
	}
	const delay =
		SUPADATA_RATE_LIMIT_CONFIG.initialRetryDelay *
		Math.pow(SUPADATA_RATE_LIMIT_CONFIG.backoffMultiplier, attempt - 1);
	return Math.min(delay, 60000);
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
const SUPADATA_API_BASE = 'https://api.supadata.ai/v1';
const REQUEST_TIMEOUT_MS = 20_000;

export async function makeSupadataRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | string[] | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const url = new URL(`${SUPADATA_API_BASE}/${endpoint.replace(/^\//, '')}`);

	if (method === 'GET' && query) {
		for (const [key, value] of Object.entries(query)) {
			if (value === undefined) continue;
			if (Array.isArray(value)) {
				for (const item of value) url.searchParams.append(key, item);
			} else {
				url.searchParams.set(key, String(value));
			}
		}
	}

	const requestBody =
		method === 'POST' || method === 'PUT' || method === 'PATCH'
			? JSON.stringify(body ?? {})
			: undefined;

	const headers: Record<string, string> = {
		Accept: 'application/json',
		'x-api-key': apiKey,
	};
	if (requestBody !== undefined) {
		headers['Content-Type'] = 'application/json';
	}

	const rateLimitConfig = SUPADATA_RATE_LIMIT_CONFIG;
	const maxAttempts = rateLimitConfig.maxRetries + 1;
	let attempt = 0;

	while (attempt < maxAttempts) {
		attempt++;

		let res: Response;
		try {
			// redirect: 'error' prevents the x-api-key credential from being
			// forwarded silently to a redirect target. The corsair/http request()
			// wrapper does not expose a redirect option, so we use fetch() directly
			// here — following the same pattern used by vestaboard and castingwords.
			res = await fetch(url, {
				method,
				redirect: 'error',
				headers,
				body: requestBody,
				signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
			});
		} catch (error) {
			// Network errors (including redirect errors and timeouts) are non-retryable.
			throw error instanceof Error ? error : new Error('Network error');
		}

		// Handle rate limiting (429 status code)
		if (res.status === 429) {
			const retryAfterMs = extractRetryAfterMs(res);
			if (attempt < maxAttempts) {
				const delay = calculateRetryDelay(attempt, retryAfterMs);
				await sleep(delay);
				continue;
			}
		}

		if (!res.ok) {
			let errorBody: unknown;
			try {
				const ct = res.headers.get('content-type') ?? '';
				errorBody = ct.includes('application/json')
					? await res.json()
					: await res.text();
			} catch {
				errorBody = undefined;
			}
			const message =
				(errorBody &&
				typeof errorBody === 'object' &&
				'message' in errorBody &&
				typeof (errorBody as Record<string, unknown>).message === 'string'
					? (errorBody as Record<string, unknown>).message
					: null) ??
				(errorBody &&
				typeof errorBody === 'object' &&
				'error' in errorBody &&
				typeof (errorBody as Record<string, unknown>).error === 'string'
					? (errorBody as Record<string, unknown>).error
					: null) ??
				`Supadata API error: ${res.status} ${res.statusText}`;
			const err = new Error(message as string);
			(err as Error & { status: number }).status = res.status;
			throw err;
		}

		const ct = res.headers.get('content-type') ?? '';
		if (res.status === 204 || !ct) {
			return undefined as T;
		}
		if (ct.includes('application/json')) {
			return (await res.json()) as T;
		}
		return (await res.text()) as unknown as T;
	}

	throw new Error('Supadata: exceeded maximum retry attempts');
}
