import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export type DeployHQJsonValue =
	| string
	| number
	| boolean
	| null
	| DeployHQJsonValue[]
	| { [key: string]: DeployHQJsonValue };

export type DeployHQQueryValue = string | number | boolean | undefined;

export type DeployHQCredentials = {
	apiKey?: string;
	username?: string;
	accountSubdomain?: string;
};

export type DeployHQRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: DeployHQJsonValue;
	query?: Record<string, DeployHQQueryValue>;
	formData?: Record<string, string | boolean>;
	binary?: boolean;
	public?: boolean;
	signup?: boolean;
};

export class DeployHQAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'DeployHQAPIError';
	}
}

const DEPLOYHQ_API_VERSION = '1.0.0';
const DEPLOYHQ_TIMEOUT_MS = 20_000;
const MAX_BINARY_RESPONSE_BYTES = 10 * 1024 * 1024;
const MAX_BINARY_RETRIES = 3;

const SAFE_READ_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1_000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
	isRateLimitError: (status) => status === 503,
};

const WRITE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'Retry-After' },
	isRateLimitError: (status) => status === 503,
};

function parseRetryAfter(response: Response): number | undefined {
	const header = response.headers.get('Retry-After');
	if (header === null) return undefined;
	const seconds = Number(header);
	if (Number.isFinite(seconds)) return Math.max(0, seconds * 1_000);
	const date = Date.parse(header);
	return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
}

function resolveAccountSubdomain(accountSubdomain: string | undefined): string {
	if (
		!accountSubdomain ||
		!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(accountSubdomain)
	) {
		throw new Error(
			'DeployHQ accountSubdomain must be configured as the account permalink.',
		);
	}
	return accountSubdomain;
}

function basicAuthorization(username: string, apiKey: string): string {
	return `Basic ${btoa(`${username}:${apiKey}`)}`;
}

function encodeBase64(bytes: Uint8Array): string {
	let binary = '';
	const chunkSize = 32_768;
	for (let offset = 0; offset < bytes.length; offset += chunkSize) {
		const chunk = bytes.subarray(
			offset,
			Math.min(offset + chunkSize, bytes.length),
		);
		binary += String.fromCharCode(...chunk);
	}
	return btoa(binary);
}

async function readBoundedBytes(response: Response): Promise<Uint8Array> {
	const contentLength = Number(response.headers.get('Content-Length'));
	if (
		Number.isFinite(contentLength) &&
		contentLength > MAX_BINARY_RESPONSE_BYTES
	) {
		await response.body?.cancel().catch(() => undefined);
		throw new DeployHQAPIError(
			`DeployHQ binary response exceeded the ${MAX_BINARY_RESPONSE_BYTES}-byte plugin safety cap.`,
		);
	}
	const reader = response.body?.getReader();
	if (!reader) return new Uint8Array();
	const chunks: Uint8Array[] = [];
	let byteCount = 0;
	try {
		while (true) {
			const chunk = await reader.read();
			if (chunk.done) break;
			byteCount += chunk.value.byteLength;
			if (byteCount > MAX_BINARY_RESPONSE_BYTES) {
				await reader.cancel();
				throw new DeployHQAPIError(
					`DeployHQ binary response exceeded the ${MAX_BINARY_RESPONSE_BYTES}-byte plugin safety cap.`,
				);
			}
			chunks.push(chunk.value);
		}
	} finally {
		reader.releaseLock();
	}
	const bytes = new Uint8Array(byteCount);
	let offset = 0;
	for (const chunk of chunks) {
		bytes.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return bytes;
}

function readErrorField(body: unknown, key: string): unknown {
	// `unknown` because parsed provider error JSON is untrusted until the specific field is narrowed.
	if (typeof body !== 'object' || body === null || Array.isArray(body))
		return undefined;
	return Object.getOwnPropertyDescriptor(body, key)?.value;
}

const EMAIL_PATTERN = /[^\s@<>"'(),;:]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+/g;

function redactProviderText(
	text: string,
	credentials: DeployHQCredentials,
): string {
	let safeText = text;
	for (const secret of [credentials.apiKey, credentials.username]) {
		if (secret) safeText = safeText.split(secret).join('[redacted]');
	}
	// A reason can name another user or a customer, so no email address leaves.
	// Callers keep at most MAX_PROVIDER_DETAIL_LENGTH characters, so the scan is
	// bounded first.
	return safeText
		.slice(0, MAX_PROVIDER_DETAIL_LENGTH * 4)
		.replace(EMAIL_PATTERN, '[redacted]');
}

const MAX_PROVIDER_DETAIL_LENGTH = 300;

// Builds a short reason from DeployHQ's JSON error body: `hint`, `error`, `message`,
// an `errors` list, or Rails-style `{ field: [messages] }` validation errors.
function providerErrorDetail(
	// `unknown` because the provider error JSON is arbitrary until its documented fields are narrowed.
	body: unknown,
	credentials: DeployHQCredentials,
): string | undefined {
	if (typeof body !== 'object' || body === null || Array.isArray(body))
		return undefined;
	let detail: string | undefined;
	for (const key of ['hint', 'error', 'message']) {
		const value = readErrorField(body, key);
		if (typeof value === 'string' && value.length > 0) {
			detail = value;
			break;
		}
	}
	if (!detail) {
		const errors = readErrorField(body, 'errors');
		const messages: string[] = [];
		if (Array.isArray(errors)) {
			for (const item of errors)
				if (typeof item === 'string') messages.push(item);
		} else {
			for (const [field, value] of Object.entries(body)) {
				if (!Array.isArray(value)) continue;
				for (const item of value)
					if (typeof item === 'string') messages.push(`${field} ${item}`);
			}
		}
		if (messages.length > 0) detail = messages.join('; ');
	}
	if (!detail) {
		const errorCode = readErrorField(body, 'error_code');
		if (typeof errorCode === 'string') detail = errorCode;
	}
	if (!detail) return undefined;
	return redactProviderText(detail, credentials).slice(
		0,
		MAX_PROVIDER_DETAIL_LENGTH,
	);
}

function failureMessage(
	status: number,
	detail: string | undefined,
	subject = 'request',
): string {
	return detail
		? `DeployHQ ${subject} failed with HTTP ${status}: ${detail}`
		: `DeployHQ ${subject} failed with HTTP ${status}.`;
}

async function readProviderErrorHint(
	response: Response,
	credentials: DeployHQCredentials,
): Promise<string | undefined> {
	const contentType = response.headers.get('Content-Type')?.toLowerCase() ?? '';
	if (!contentType.startsWith('application/json')) {
		await response.body?.cancel().catch(() => undefined);
		return undefined;
	}
	try {
		// `unknown` because the provider error JSON is arbitrary until its documented fields are narrowed.
		const body: unknown = await response.json();
		return providerErrorDetail(body, credentials);
	} catch {
		// Invalid or unreadable provider error bodies are not propagated to callers.
		return undefined;
	}
}

async function makeBinaryDeployHQRequest(
	endpoint: string,
	baseUrl: string,
	credentials: DeployHQCredentials,
	options: DeployHQRequestOptions,
	authorization: string,
	// `unknown` because the result is either the binary envelope or a JSON string,
	// and the operation's output schema narrows it.
): Promise<unknown> {
	const url = new URL(endpoint, baseUrl);
	for (const [name, value] of Object.entries(options.query ?? {})) {
		if (value !== undefined) url.searchParams.set(name, String(value));
	}
	try {
		for (let attempt = 0; attempt <= MAX_BINARY_RETRIES; attempt += 1) {
			const response = await fetch(url, {
				method: options.method ?? 'GET',
				headers: {
					Accept: 'application/pdf, application/octet-stream, application/json',
					Authorization: authorization,
				},
				signal: AbortSignal.timeout(DEPLOYHQ_TIMEOUT_MS),
			});
			const retryAfter = parseRetryAfter(response);
			if (!response.ok) {
				if (
					(response.status === 429 || response.status === 503) &&
					attempt < MAX_BINARY_RETRIES
				) {
					await response.body?.cancel().catch(() => undefined);
					const backoff = Math.min(1_000 * 2 ** attempt, 60_000);
					await new Promise((resolve) =>
						setTimeout(resolve, retryAfter ?? backoff),
					);
					continue;
				}
				const hint = await readProviderErrorHint(response, credentials);
				throw new DeployHQAPIError(
					failureMessage(response.status, hint, 'invoice request'),
					response.status,
					retryAfter,
				);
			}
			const contentType =
				response.headers.get('Content-Type') ?? 'application/pdf';
			if (contentType.toLowerCase().startsWith('application/json')) {
				// `unknown` because a JSON response is untrusted until the operation output schema validates it.
				const jsonResponse: unknown = await response.json();
				return jsonResponse;
			}
			const bytes = await readBoundedBytes(response);
			return {
				kind: 'binary',
				contentType,
				base64: encodeBase64(bytes),
				sizeBytes: bytes.byteLength,
			};
		}
		throw new DeployHQAPIError(
			'DeployHQ invoice request exceeded its retry budget.',
		);
	} catch (error: unknown) {
		// `unknown` because fetch, timeout, and response decoding failures may reject with arbitrary values.
		if (error instanceof DeployHQAPIError) throw error;
		throw new DeployHQAPIError(
			'DeployHQ invoice request failed before a valid response was received.',
		);
	}
}

// `unknown` because each caller must validate untrusted provider JSON with its operation output schema.
export async function makeDeployHQRequest(
	endpoint: string,
	credentials: DeployHQCredentials,
	options: DeployHQRequestOptions = {},
): Promise<unknown> {
	const method = options.method ?? 'GET';
	const isPublic = options.public === true;
	const baseUrl = options.signup
		? 'https://api.deployhq.com'
		: `https://${resolveAccountSubdomain(credentials.accountSubdomain)}.deployhq.com`;
	let headers: Record<string, string> = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};
	if (!isPublic) {
		if (credentials.apiKey !== undefined && credentials.apiKey.length === 0) {
			throw new AuthMissingError('deployhq', 'api_key');
		}
		if (!credentials.apiKey || !credentials.username) {
			throw new AuthMissingError('deployhq', 'api_key');
		}
		headers = {
			...headers,
			Authorization: basicAuthorization(
				credentials.username,
				credentials.apiKey,
			),
		};
	}
	if (options.binary) {
		const authorization = headers.Authorization;
		if (!authorization) throw new AuthMissingError('deployhq', 'api_key');
		return makeBinaryDeployHQRequest(
			endpoint,
			baseUrl,
			credentials,
			options,
			authorization,
		);
	}

	if (options.formData) {
		const url = new URL(endpoint, baseUrl);
		for (const [name, value] of Object.entries(options.query ?? {})) {
			if (value !== undefined) url.searchParams.set(name, String(value));
		}
		const form = new FormData();
		for (const [name, value] of Object.entries(options.formData))
			form.set(name, String(value));
		const formHeaders = {
			Accept: 'application/json',
			...(isPublic ? {} : { Authorization: headers.Authorization }),
		};
		try {
			const response = await fetch(url, {
				method,
				headers: formHeaders,
				body: form,
				signal: AbortSignal.timeout(DEPLOYHQ_TIMEOUT_MS),
			});
			if (!response.ok) {
				const retryAfter = parseRetryAfter(response);
				const detail = await readProviderErrorHint(response, credentials);
				throw new DeployHQAPIError(
					failureMessage(response.status, detail),
					response.status,
					retryAfter,
				);
			}
			// `unknown` because parsed provider JSON is untrusted until the operation output schema validates it.
			const result: unknown = await response.json();
			return result;
		} catch (error: unknown) {
			// `unknown` because fetch and response parsing can reject with non-Error values.
			if (error instanceof DeployHQAPIError) throw error;
			if (error instanceof Error)
				throw new DeployHQAPIError(
					'DeployHQ request failed before a response was received.',
				);
			throw new DeployHQAPIError(
				'DeployHQ request failed before a response was received.',
			);
		}
	}

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: DEPLOYHQ_API_VERSION,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: headers,
		...(DEPLOYHQ_TIMEOUT_MS ? { TIMEOUT: DEPLOYHQ_TIMEOUT_MS } : {}),
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? options.body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: options.query,
	};
	const retryConfig =
		method === 'GET' ? SAFE_READ_RATE_LIMIT_CONFIG : WRITE_RATE_LIMIT_CONFIG;

	try {
		// `unknown` because the provider response remains untrusted until the endpoint's output schema parses it.
		const result: unknown = await request<unknown>(config, requestOptions, {
			rateLimitConfig: retryConfig,
		});
		return result;
	} catch (error: unknown) {
		// `unknown` because the shared HTTP transport may reject with arbitrary values.
		if (error instanceof ApiError) {
			// Do not rethrow ApiError: it retains the unsanitized request body and provider error body.
			// Only a short, redacted reason from the error body is kept.
			throw new DeployHQAPIError(
				failureMessage(
					error.status,
					providerErrorDetail(error.body, credentials),
				),
				error.status,
				error.retryAfter,
			);
		}
		if (error instanceof DeployHQAPIError) throw error;
		if (error instanceof Error)
			throw new DeployHQAPIError(
				'DeployHQ request failed before a response was received.',
			);
		throw new DeployHQAPIError(
			'DeployHQ request failed before a response was received.',
		);
	}
}
