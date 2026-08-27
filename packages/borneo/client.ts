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

/**
 * Normalizes the Composio API base URL and rejects non-HTTPS endpoints.
 */
export function normalizeComposioBaseUrl(
	value = DEFAULT_COMPOSIO_API_BASE_URL,
): string {
	return normalizeHttpsBaseUrl(value, 'composioBaseUrl');
}

/**
 * Builds Composio custom-auth parameters without confusing the provider
 * credential with the Composio project API key.
 */
function buildCustomAuthParams(options: BorneoExecutionOptions) {
	if (options.connectedAccountId) return undefined;

	if (!options.borneoCredential) {
		throw new Error(
			'[borneo] configure connectedAccountId or provide a Borneo credential',
		);
	}

	if (!options.credentialHeaderName) {
		throw new Error(
			'[borneo] credentialHeaderName is required when using direct custom auth',
		);
	}

	const prefix = options.credentialPrefix ?? '';

	return {
		parameters: [
			{
				in: 'header' as const,
				name: options.credentialHeaderName,
				value: `${prefix}${options.borneoCredential}`,
			},
		],
		...(options.borneoBaseUrl
			? {
					base_url: normalizeHttpsBaseUrl(
						options.borneoBaseUrl,
						'borneoBaseUrl',
					),
				}
			: {}),
	};
}

/**
 * Suspends execution for the requested backoff interval.
 */
function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
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
async function readResponseBody(response: Response): Promise<unknown> {
	if (response.status === 204) return undefined;

	const contentType = response.headers.get('Content-Type') ?? '';

	if (
		contentType.toLowerCase().startsWith('application/json') ||
		contentType.toLowerCase().startsWith('application/problem+json')
	) {
		return await response.json();
	}

	return await response.text();
}

/**
 * Removes provider custom-auth secrets before request metadata is attached
 * to ApiError instances.
 */
function redactRequestBody(
	body: Record<string, unknown>,
): Record<string, unknown> {
	if (!('custom_auth_params' in body)) {
		return { ...body };
	}

	return {
		...body,
		custom_auth_params: '[REDACTED]',
	};
}

/**
 * Creates an ApiError compatible with Corsair's existing Borneo error handlers
 * without persisting provider credentials in its request metadata.
 */
function createApiError(
	requestOptions: ApiRequestOptions,
	url: string,
	response: Response,
	body: unknown,
	retryAfterMs?: number,
): ApiError {
	const message =
		typeof body === 'object' &&
		body !== null &&
		'message' in body &&
		typeof (body as { message?: unknown }).message === 'string'
			? (body as { message: string }).message
			: `Borneo request failed with HTTP ${response.status}`;

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
export async function executeBorneoTool<T>(
	toolSlug: string,
	arguments_: Record<string, unknown>,
	options: BorneoExecutionOptions,
): Promise<T> {
	if (!options.composioApiKey.trim()) {
		throw new Error('[borneo] composioApiKey is required');
	}

	const base = normalizeComposioBaseUrl(options.composioBaseUrl);
	const url = `${base}/tools/execute/${encodeURIComponent(toolSlug)}`;
	const timeoutMs = resolveTimeoutMs(options.timeoutMs);

	const body: Record<string, unknown> = {
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
		const response = await fetch(url, {
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

		const responseBody = await readResponseBody(response);

		if (response.ok) {
			return responseBody as T;
		}

		const retryAfterMs = parseRetryAfterMs(response);

		if (
			response.status === 429 &&
			riskLevel === 'read' &&
			attempt < maxRetries
		) {
			const delay =
				retryAfterMs ?? INITIAL_RETRY_DELAY_MS * BACKOFF_MULTIPLIER ** attempt;

			await sleep(delay);
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
