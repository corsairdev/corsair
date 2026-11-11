import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { z } from 'zod';
import { buildSignedString, signRequest } from './signing';

export type KalshiEnvironment = 'demo' | 'production';

export const KALSHI_API_BASES: Record<KalshiEnvironment, string> = {
	demo: 'https://external-api.demo.kalshi.co/trade-api/v2',
	production: 'https://external-api.kalshi.com/trade-api/v2',
};

/** Kalshi signs the path from the API root, so the base URL's path is part of it. */
export const KALSHI_SIGNED_PATH_PREFIX = '/trade-api/v2';

export class KalshiAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// `unknown` because this is whatever JSON Kalshi returned on an error, and its
	// shape varies by status code; callers narrow it before use.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: string,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'KalshiAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

const KalshiCredentialsSchema = z.object({
	keyId: z.string().min(1),
	privateKey: z.string().min(1),
	environment: z.enum(['demo', 'production']).default('production'),
});

export type KalshiCredentials = z.infer<typeof KalshiCredentialsSchema>;

/**
 * Corsair hands a plugin one string as its key, but Kalshi needs a key ID and a
 * private key. The key builder packs both (plus the environment) into JSON and
 * this parses them back out.
 */
export function serializeKalshiCredentials(
	credentials: z.input<typeof KalshiCredentialsSchema>,
): string {
	return JSON.stringify(credentials);
}

export function parseKalshiCredentials(
	credentialsString: string,
): KalshiCredentials {
	// `unknown` because this is untrusted JSON, narrowed by the Zod schema below.
	let raw: unknown;
	try {
		raw = JSON.parse(credentialsString);
	} catch {
		throw new Error(
			'Invalid Kalshi credentials: both an API key ID and a private key are required',
		);
	}
	const parsed = KalshiCredentialsSchema.safeParse(raw);
	if (!parsed.success) {
		throw new Error(
			'Invalid Kalshi credentials: both an API key ID and a private key are required',
		);
	}
	return {
		...parsed.data,
		// PEMs pasted into env vars or forms often carry literal "\n" sequences.
		privateKey: parsed.data.privateKey.replace(/\\n/g, '\n'),
	};
}

/**
 * Turns off the HTTP client's own 429 retries. Those would resend the same
 * signed headers (a stale timestamp and signature) and stack on top of the
 * plugin's retries, so the endpoint binder owns retrying and every attempt is
 * signed afresh.
 */
const NO_HTTP_RETRIES: RateLimitConfig = {
	enabled: false,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {},
};

export async function makeKalshiRequest<T>(
	endpoint: string,
	credentialsString: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// `unknown` values because each endpoint's Zod input schema has already
		// validated the body; this layer only serialises it.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const credentials = parseKalshiCredentials(credentialsString);

	// A fresh timestamp per call: Kalshi rejects stale ones. The HTTP client's
	// own retries are off (see NO_HTTP_RETRIES), so a retry after a 429 re-enters
	// this function and is re-signed.
	const timestamp = Date.now().toString();
	const signature = signRequest(
		buildSignedString(
			timestamp,
			method,
			`${KALSHI_SIGNED_PATH_PREFIX}${endpoint}`,
		),
		credentials.privateKey,
	);

	const config: OpenAPIConfig = {
		BASE: KALSHI_API_BASES[credentials.environment],
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			'KALSHI-ACCESS-KEY': credentials.keyId,
			'KALSHI-ACCESS-TIMESTAMP': timestamp,
			'KALSHI-ACCESS-SIGNATURE': signature,
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
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: NO_HTTP_RETRIES,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new KalshiAPIError(error.message, String(error.status), {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new KalshiAPIError(error.message, undefined, { cause: error });
		}
		throw new KalshiAPIError('Unknown error');
	}
}
