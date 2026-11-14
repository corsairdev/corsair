import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { EncodianOperationRoutes } from './endpoints/generated';

const ENCODIAN_API_BASE = 'https://api.apps-encodian.com';
const REDACTED = '[REDACTED]';
const MAX_QUEUE_POLLS = 30;
const MAX_QUEUE_DURATION_MS = 120_000;
const DEFAULT_QUEUE_POLL_DELAY_MS = 1_000;
const REQUEST_TIMEOUT_MS = 20_000;
const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

type EncodianRoute =
	(typeof EncodianOperationRoutes)[keyof typeof EncodianOperationRoutes];

function parseRetryAfter(response: Response): number | undefined {
	const value = response.headers.get('Retry-After');
	if (value === null) return undefined;
	const seconds = Number(value);
	if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1_000;
	const date = Date.parse(value);
	return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
}

function createHttpError(
	response: Response,
	url: URL,
	method: ApiRequestOptions['method'],
	// `unknown` because caller bodies are operation-specific JSON and are redacted before constructing ApiError.
	body: unknown,
): ApiError {
	const safeUrl = `${url.origin}${url.pathname}`;
	const requestBody = body === undefined ? undefined : REDACTED;
	const retryAfter =
		response.status === 429 ? parseRetryAfter(response) : undefined;
	return new ApiError(
		{ method, url: safeUrl, body: requestBody },
		{
			url: safeUrl,
			ok: false,
			status: response.status,
			statusText: response.statusText,
			body: REDACTED,
		},
		`Encodian request failed with HTTP ${response.status}`,
		{ retryAfter },
	);
}

function buildUrl(
	path: string,
	query?: Record<string, string | number | boolean | undefined>,
): URL {
	const url = new URL(path, ENCODIAN_API_BASE);
	for (const [name, value] of Object.entries(query ?? {})) {
		if (value !== undefined) url.searchParams.set(name, String(value));
	}
	return url;
}

function getPollUrl(location: string, requestUrl: URL): URL {
	const url = new URL(location, requestUrl);
	if (
		url.protocol !== 'https:' ||
		url.origin !== ENCODIAN_API_BASE ||
		url.username !== '' ||
		url.password !== ''
	) {
		throw new Error('Encodian returned an unsafe queued-operation URL');
	}
	return url;
}

function pollDelayMs(response: Response): number {
	return parseRetryAfter(response) ?? DEFAULT_QUEUE_POLL_DELAY_MS;
}

function sleep(milliseconds: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

// `unknown` because provider JSON remains untrusted until the operation output schema checks it.
async function readJson(response: Response): Promise<unknown> {
	return response.json();
}

async function pollQueuedOperation(
	location: string,
	requestUrl: URL,
	apiKey: string,
	// `unknown` because caller bodies remain provider payloads and are only used in redacted errors.
	body: unknown,
): Promise<unknown> {
	const pollUrl = getPollUrl(location, requestUrl);
	const deadline = Date.now() + MAX_QUEUE_DURATION_MS;
	for (let poll = 0; poll < MAX_QUEUE_POLLS; poll += 1) {
		const remainingMs = deadline - Date.now();
		if (remainingMs <= 0)
			throw new Error('Encodian queued operation timed out');
		const response = await fetch(pollUrl, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'X-ApiKey': apiKey,
			},
			signal: AbortSignal.timeout(Math.min(REQUEST_TIMEOUT_MS, remainingMs)),
			redirect: 'error',
		});
		if (response.status === 200) return readJson(response);
		if (response.status !== 202) {
			throw createHttpError(response, pollUrl, 'GET', body);
		}
		const remainingAfterResponse = deadline - Date.now();
		if (remainingAfterResponse <= 0)
			throw new Error('Encodian queued operation timed out');
		const delayMs = Math.min(pollDelayMs(response), remainingAfterResponse);
		if (delayMs > 0) await sleep(delayMs);
	}
	throw new Error('Encodian queued operation exceeded the polling limit');
}

// `unknown` because provider responses stay untrusted until the operation output schema parses them.
export async function makeEncodianRequest(
	route: EncodianRoute,
	apiKey: string,
	input: {
		// `unknown` because each route has a different request DTO validated before reaching this transport.
		body?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
		path?: Record<string, string | number>;
	},
): Promise<unknown> {
	const path = route.path.replace(
		/\{([^}]+)\}/g,
		(_match, parameter: string) => {
			const value = input.path?.[parameter];
			return encodeURIComponent(String(value ?? ''));
		},
	);
	const url = buildUrl(path, input.query);
	const config: OpenAPIConfig = {
		BASE: ENCODIAN_API_BASE,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-ApiKey': apiKey,
		},
	};
	const requestOptions: ApiRequestOptions = {
		method: route.method,
		url: path,
		body: input.body,
		mediaType: 'application/json; charset=utf-8',
		query: input.query,
		responseHeader: 'Location',
	};

	try {
		// `unknown` because HTTP JSON is untrusted until the operation output schema parses it.
		const response = await request<unknown>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
		if (route.method === 'POST' && typeof response === 'string') {
			return pollQueuedOperation(response, url, apiKey, input.body);
		}
		return response;
		// `unknown` because transport rejections do not have a guaranteed runtime class.
	} catch (error: unknown) {
		if (error instanceof ApiError) {
			throw new ApiError(
				{
					...error.request,
					body: error.request.body === undefined ? undefined : REDACTED,
				},
				{
					url: error.url,
					ok: false,
					status: error.status,
					statusText: error.statusText,
					body: REDACTED,
				},
				`Encodian request failed with HTTP ${error.status}`,
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
				},
			);
		}
		throw error;
	}
}
