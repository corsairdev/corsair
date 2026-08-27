import type { ApiRequestOptions } from 'corsair/http';
import { ApiError } from 'corsair/http';
import { BORNEO_TOOLKIT_VERSION } from './operations';

const DEFAULT_COMPOSIO_API_BASE_URL = 'https://backend.composio.dev/api/v3';

const MAX_RETRIES = 5;
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
};

export function normalizeComposioBaseUrl(
	value = DEFAULT_COMPOSIO_API_BASE_URL,
): string {
	const trimmed = value.trim().replace(/\/+$/, '');
	let parsed: URL;

	try {
		parsed = new URL(trimmed);
	} catch {
		throw new Error('[borneo] composioBaseUrl must be an absolute HTTPS URL');
	}

	if (parsed.protocol !== 'https:') {
		throw new Error('[borneo] composioBaseUrl must use https');
	}

	return trimmed;
}

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
					base_url: options.borneoBaseUrl.trim().replace(/\/+$/, ''),
				}
			: {}),
	};
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

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
		body,
		mediaType: 'application/json; charset=utf-8',
	};

	for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json; charset=utf-8',
				'x-api-key': options.composioApiKey,
			},
			body: JSON.stringify(body),

			// Credential-bearing requests must never follow a redirect.
			// This prevents x-api-key or custom auth data from being
			// forwarded to another origin.
			redirect: 'error',
		});

		const responseBody = await readResponseBody(response);

		if (response.ok) {
			return responseBody as T;
		}

		const retryAfterMs = parseRetryAfterMs(response);

		if (response.status === 429 && attempt < MAX_RETRIES) {
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
