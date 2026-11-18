import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const NUTSHELL_BASE_URL = 'https://app.nutshell.com/rest';

export type NutshellMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class NutshellAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// `unknown` is intentional here: the body is whatever Nutshell returned
	// (usually a JSON error object, sometimes plain text), so no narrower type
	// can be guaranteed and callers must narrow it themselves.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(message: string, options?: { cause?: Error }) {
		super(message, options);
		this.name = 'NutshellAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

export type NutshellCredentials = {
	email: string;
	apiKey: string;
};

/**
 * Splits the composite `<email>:<api-key>` credential the key builder returns.
 * The email never contains a colon, so the first one is always the separator.
 */
export function parseNutshellCredentials(key: string): NutshellCredentials {
	const separator = key.indexOf(':');
	if (separator <= 0 || separator === key.length - 1) {
		throw new NutshellAPIError(
			'Nutshell credentials must be `<email>:<api-key>`',
		);
	}
	return {
		email: key.slice(0, separator),
		apiKey: key.slice(separator + 1),
	};
}

// Nutshell asks for exponential backoff on 429 and answers reports slowly, but
// retrying belongs to the endpoint-level error handlers (which can tell reads
// from writes), so the transport never replays a request here.
const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

export type NutshellRequestOptions = {
	method?: NutshellMethod;
	// `unknown` is intentional here: bodies are provider-defined payloads
	// (objects, arrays for JSON Patch, or undefined) validated by each
	// operation's input schema before they reach this transport.
	body?: unknown;
	// `unknown` is intentional here: query values are provider-defined filter,
	// sort and pagination inputs forwarded as-is to the Nutshell REST API.
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	mediaType?: string;
};

export async function makeNutshellRequest<T>(
	endpoint: string,
	key: string,
	options: NutshellRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, headers, mediaType } = options;
	const credentials = parseNutshellCredentials(key);

	const config: OpenAPIConfig = {
		BASE: NUTSHELL_BASE_URL,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		TIMEOUT: 60_000,
		CREDENTIALS: 'omit',
		// `getHeaders` base64-encodes USERNAME/PASSWORD into a Basic header.
		USERNAME: credentials.email,
		PASSWORD: credentials.apiKey,
		HEADERS: {
			Accept: 'application/json',
			...headers,
		},
	};

	const hasBody =
		body !== undefined && !['GET', 'HEAD', 'OPTIONS'].includes(method);

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: hasBody ? body : undefined,
		mediaType: hasBody ? (mediaType ?? 'application/json') : undefined,
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: NO_TRANSPORT_RETRIES,
		});
	} catch (error) {
		if (error instanceof NutshellAPIError) throw error;
		if (error instanceof Error) {
			throw new NutshellAPIError(error.message, { cause: error });
		}
		throw new NutshellAPIError('Unknown Nutshell API error');
	}
}
