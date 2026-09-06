import type { ApiRequestOptions } from 'corsair/http';
import { ApiError } from 'corsair/http';
import type { BorneoRiskLevel } from './operation-risk';
import { BORNEO_TOOLKIT_VERSION } from './operations';

const DEFAULT_COMPOSIO_API_BASE_URL = 'https://backend.composio.dev/api/v3';
const DEFAULT_REQUEST_TIMEOUT_MS = 20_000;

const MAX_READ_RETRIES = 5;
const INITIAL_RETRY_DELAY_MS = 1000;
const BACKOFF_MULTIPLIER = 2;

export type BorneoExecutionOptions = {
	composioApiKey: string;
	connectedAccountId?: string;
	userId?: string;
	composioBaseUrl?: string;
	borneoCredential?: string;
	borneoBaseUrl?: string;
	credentialHeaderName?: string;
	credentialPrefix?: string;
	riskLevel?: BorneoRiskLevel;
	timeoutMs?: number;
	signal?: AbortSignal;
};

type ComposioJson =
	| string
	| number
	| boolean
	| null
	| ComposioJson[]
	| { [key: string]: ComposioJson };

type ComposioCustomAuthParams = {
	base_url?: string;
	parameters?: Array<{
		in: 'header';
		name: string;
		value: string;
	}>;
};

type ComposioExecuteRequest = {
	arguments: object;
	version: string;
	connected_account_id?: string;
	user_id?: string;
	custom_auth_params?: ComposioCustomAuthParams | '[REDACTED]';
};

export type ComposioToolResponse = {
	successful?: boolean;
	error?: string | { message?: string };
	data?: ComposioJson;
	log_id?: string;
};

function isJsonRecord(
	value: ComposioJson | string | undefined,
): value is { [key: string]: ComposioJson } {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSuccessfulEnvelope(
	value: ComposioJson | string | undefined,
): value is ComposioToolResponse & { successful: true } {
	return isJsonRecord(value) && value.successful === true;
}

/**
 * Validates and normalizes an absolute HTTPS base URL.
 */
function normalizeHttpsBaseUrl(value: string, optionName: string): string {
	const trimmed = value.trim().replace(/\/+$/, '');
	let parsed: URL;

	try {
		parsed = new URL(trimmed);
	} catch {
		throw new Error(`[borneo] ${optionName} must be an absolute HTTPS URL`);
	}

	if (parsed.protocol !== 'https:') {
		throw new Error(`[borneo] ${optionName} must use https`);
	}

	return trimmed;
}

function assertComposioHost(baseUrl: string): string {
	const hostname = new URL(baseUrl).hostname;

	if (hostname !== 'composio.dev' && !hostname.endsWith('.composio.dev')) {
		throw new Error('[borneo] composioBaseUrl must use a composio.dev host');
	}

	return baseUrl;
}

export function normalizeComposioBaseUrl(
	value = DEFAULT_COMPOSIO_API_BASE_URL,
): string {
	return assertComposioHost(normalizeHttpsBaseUrl(value, 'composioBaseUrl'));
}

/**
 * Builds Composio custom-auth parameters without confusing the provider
 * credential with the Composio project API key. `base_url` overrides the
 * provider base URL for both direct custom auth and connected accounts.
 */
function buildCustomAuthParams(options: BorneoExecutionOptions) {
	const baseUrl = options.borneoBaseUrl
		? normalizeHttpsBaseUrl(options.borneoBaseUrl, 'borneoBaseUrl')
		: undefined;

	if (options.connectedAccountId) {
		return baseUrl ? { base_url: baseUrl } : undefined;
	}

	if (!options.borneoCredential) {
		throw new Error(
			'[borneo] configure connectedAccountId or provide a Borneo credential',
		);
	}

	const headerName = options.credentialHeaderName ?? 'Authorization';
	const prefix =
		options.credentialPrefix ??
		(headerName.toLowerCase() === 'authorization' ? 'Bearer ' : '');

	return {
		parameters: [
			{
				in: 'header' as const,
				name: headerName,
				value: `${prefix}${options.borneoCredential}`,
			},
		],
		...(baseUrl ? { base_url: baseUrl } : {}),
	};
}

/**
 * Suspends execution for the requested backoff interval.
 */
function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Waits out a 429 backoff interval, rejecting early with the normalized abort
 * error when the caller cancels during the delay.
 */
async function sleepBeforeRetry(
	delayMs: number,
	requestOptions: ApiRequestOptions,
	url: string,
	signal: AbortSignal | undefined,
): Promise<void> {
	if (!signal) {
		await sleep(delayMs);
		return;
	}

	if (signal.aborted) {
		throw createNetworkApiError(requestOptions, url, signal.reason);
	}

	await new Promise<void>((resolve, reject) => {
		const timer = setTimeout(() => {
			signal.removeEventListener('abort', handleAbort);
			resolve();
		}, delayMs);

		const handleAbort = () => {
			clearTimeout(timer);
			reject(createNetworkApiError(requestOptions, url, signal.reason));
		};

		signal.addEventListener('abort', handleAbort, { once: true });
	});
}

/**
 * Converts Retry-After response headers to milliseconds.
 */
function parseRetryAfterMs(response: Response): number | undefined {
	const value = response.headers.get('Retry-After');

	if (!value) return undefined;

	const seconds = Number(value);

	if (Number.isFinite(seconds) && seconds >= 0) {
		return seconds * 1000;
	}

	const date = Date.parse(value);

	if (Number.isNaN(date)) return undefined;

	return Math.max(0, date - Date.now());
}

/**
 * Reads JSON/problem+json responses as structured data and other responses
 * as text.
 */
async function readResponseBody(
	response: Response,
): Promise<ComposioJson | string | undefined> {
	if (response.status === 204) return undefined;

	const contentType = response.headers.get('Content-Type') ?? '';

	if (
		contentType.toLowerCase().startsWith('application/json') ||
		contentType.toLowerCase().startsWith('application/problem+json')
	) {
		// Response.json() has no schema; the value is JSON we narrow at the envelope.
		return (await response.json()) as ComposioJson;
	}

	return await response.text();
}

/**
 * Removes provider custom-auth secrets before request metadata is attached
 * to ApiError instances.
 */
function redactRequestBody(
	body: ComposioExecuteRequest,
): ComposioExecuteRequest {
	if (!('custom_auth_params' in body)) {
		return { ...body };
	}

	return {
		...body,
		custom_auth_params: '[REDACTED]',
	};
}

/**
 * Extracts the provider-supplied error message from a request-level error
 * body, covering both `{error: {message}}` and legacy `{error}` shapes.
 */
function extractProviderErrorMessage(
	body: ComposioJson | string | undefined,
): string | undefined {
	if (!isJsonRecord(body)) return undefined;

	if (typeof body.message === 'string') return body.message;

	if (typeof body.error === 'string') return body.error;

	if (isJsonRecord(body.error) && typeof body.error.message === 'string') {
		return body.error.message;
	}

	return undefined;
}

/**
 * Creates an ApiError compatible with Corsair's existing Borneo error handlers
 * without persisting provider credentials in its request metadata.
 */
function createApiError(
	requestOptions: ApiRequestOptions,
	url: string,
	response: Response,
	body: ComposioJson | string | undefined,
	retryAfterMs?: number,
): ApiError {
	const message =
		extractProviderErrorMessage(body) ??
		`Borneo request failed with HTTP ${response.status}`;

	return new ApiError(
		requestOptions,
		{
			url,
			ok: response.ok,
			status: response.status,
			statusText: response.statusText,
			body,
		},
		message,
		retryAfterMs !== undefined
			? {
					retryAfter: retryAfterMs,
				}
			: undefined,
	);
}

/**
 * Normalizes transport-level failures (DNS, TLS, timeouts, cancellation) that
 * never produced an HTTP response into structured ApiError instances.
 */
function createNetworkApiError(
	requestOptions: ApiRequestOptions,
	url: string,
	error: Error,
): ApiError {
	const reason = error.message;

	return new ApiError(
		requestOptions,
		{
			url,
			ok: false,
			status: 0,
			statusText: reason,
			body: undefined,
		},
		`Borneo request failed before receiving a response: ${reason}`,
	);
}

/**
 * Composio reports provider-level tool failures with HTTP 200 and a
 * `successful: false` envelope, so the execution flag must be validated even
 * after a successful HTTP response.
 */
function assertExecutionSuccessful(
	requestOptions: ApiRequestOptions,
	url: string,
	response: Response,
	body: ComposioJson | string | undefined,
): void {
	if (isSuccessfulEnvelope(body)) {
		return;
	}

	const providerError = extractProviderErrorMessage(body);

	throw new ApiError(
		requestOptions,
		{
			url,
			ok: false,
			status: response.status,
			statusText: response.statusText,
			body,
		},
		providerError
			? `Borneo tool execution failed: ${providerError}`
			: 'Borneo tool execution failed',
	);
}

/**
 * Validates the configured request timeout.
 */
function resolveTimeoutMs(timeoutMs?: number): number {
	const value = timeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS;

	if (!Number.isFinite(value) || value <= 0) {
		throw new Error('[borneo] timeoutMs must be a positive finite number');
	}

	return value;
}

/**
 * Combines the optional caller cancellation signal with a finite deadline.
 */
function createRequestSignal(
	timeoutMs: number,
	callerSignal?: AbortSignal,
): AbortSignal {
	const timeoutSignal = AbortSignal.timeout(timeoutMs);

	return callerSignal
		? AbortSignal.any([callerSignal, timeoutSignal])
		: timeoutSignal;
}

/**
 * Executes one canonical Borneo toolkit operation through Composio.
 *
 * Read-only operations may retry HTTP 429 responses. Write and destructive
 * operations are never automatically retried because a rate-limit response
 * does not prove that the upstream side effect was not already committed.
 *
 * Credential-bearing redirects are rejected, every request has a bounded
 * deadline, and caller cancellation is propagated when supplied.
 */
export async function executeBorneoTool(
	toolSlug: string,
	arguments_: object,
	options: BorneoExecutionOptions,
): Promise<ComposioToolResponse> {
	if (!options.composioApiKey.trim()) {
		throw new Error('[borneo] composioApiKey is required');
	}

	const base = normalizeComposioBaseUrl(options.composioBaseUrl);
	const url = `${base}/tools/execute/${encodeURIComponent(toolSlug)}`;
	const timeoutMs = resolveTimeoutMs(options.timeoutMs);

	const body: ComposioExecuteRequest = {
		arguments: arguments_,
		version: BORNEO_TOOLKIT_VERSION,
	};

	if (options.connectedAccountId) {
		body.connected_account_id = options.connectedAccountId;
	}

	if (options.userId) {
		body.user_id = options.userId;
	}

	const customAuthParams = buildCustomAuthParams(options);

	if (customAuthParams) {
		body.custom_auth_params = customAuthParams;
	}

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: `/tools/execute/${encodeURIComponent(toolSlug)}`,
		body: redactRequestBody(body),
		mediaType: 'application/json; charset=utf-8',
	};

	const riskLevel = options.riskLevel ?? 'write';
	const maxRetries = riskLevel === 'read' ? MAX_READ_RETRIES : 0;

	for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
		let response: Response;

		try {
			response = await fetch(url, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json; charset=utf-8',
					'x-api-key': options.composioApiKey,
				},
				body: JSON.stringify(body),
				redirect: 'error',
				signal: createRequestSignal(timeoutMs, options.signal),
			});
		} catch (error) {
			throw createNetworkApiError(
				requestOptions,
				url,
				error instanceof Error ? error : new Error(String(error)),
			);
		}

		const responseBody = await readResponseBody(response);

		if (response.ok) {
			assertExecutionSuccessful(requestOptions, url, response, responseBody);

			if (!isSuccessfulEnvelope(responseBody)) {
				throw new Error('[borneo] successful envelope narrowing failed');
			}

			return responseBody;
		}

		const retryAfterMs = parseRetryAfterMs(response);

		if (
			response.status === 429 &&
			riskLevel === 'read' &&
			attempt < maxRetries
		) {
			const delay =
				retryAfterMs ?? INITIAL_RETRY_DELAY_MS * BACKOFF_MULTIPLIER ** attempt;

			await sleepBeforeRetry(delay, requestOptions, url, options.signal);
			continue;
		}

		throw createApiError(
			requestOptions,
			url,
			response,
			responseBody,
			retryAfterMs,
		);
	}

	throw new Error('[borneo] exhausted request retry attempts');
}
