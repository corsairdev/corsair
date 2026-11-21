import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const PIPEDRIVE_API_BASE = 'https://api.pipedrive.com/api/v2';
export const PIPEDRIVE_API_V1_BASE = 'https://api.pipedrive.com/v1';
export const PIPEDRIVE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	// Error handlers own 429 retries so daily-budget exhaustion is not replayed.
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		// Pipedrive documents this as the remaining burst-window reset duration.
		retryAfter: 'x-ratelimit-reset',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

type PipedriveAuthType = 'api_key' | 'oauth_2';
const REDACTED_ERROR_VALUE = '[REDACTED]';
const SENSITIVE_ERROR_FIELDS = new Set([
	'accesskeyid',
	'accesstoken',
	'apikey',
	'apitoken',
	'appkey',
	'authorization',
	'authtoken',
	'clientemail',
	'clientsecret',
	'email',
	'password',
	'privatekey',
	'projectid',
	'refreshtoken',
	'sastoken',
	'secret',
	'secretaccesskey',
	'sessiontoken',
	'storageaccesskey',
	'token',
	'xapikey',
	'xapitoken',
]);
const SHORT_CUSTOMER_VALUE_FIELDS = new Set([
	'address',
	'companyname',
	'content',
	'customername',
	'description',
	'firstname',
	'lastname',
	'message',
	'name',
	'notes',
	'organizationname',
	'personname',
	'phone',
	'search',
	'subject',
	'term',
	'title',
	'username',
]);
const SAFE_ERROR_CODE_FIELDS = new Set(['code', 'errorcode']);

function normalizedErrorField(fieldName: string): string {
	return fieldName.toLowerCase().replace(/[-_]/g, '');
}

function isSensitiveErrorField(fieldName: string): boolean {
	return SENSITIVE_ERROR_FIELDS.has(normalizedErrorField(fieldName));
}

function isShortCustomerValueField(fieldName: string): boolean {
	const normalizedField = normalizedErrorField(fieldName);
	return (
		isSensitiveErrorField(fieldName) ||
		SHORT_CUSTOMER_VALUE_FIELDS.has(normalizedField) ||
		normalizedField === 'id' ||
		normalizedField.endsWith('id')
	);
}

function isSafeErrorCodeField(fieldName: string): boolean {
	return SAFE_ERROR_CODE_FIELDS.has(normalizedErrorField(fieldName));
}

function isErrorWordCharacter(character: string | undefined): boolean {
	return character !== undefined && /[\p{L}\p{N}_]/u.test(character);
}

function redactWholeErrorValue(text: string, value: string): string {
	let redacted = '';
	let copiedThrough = 0;
	let index = text.indexOf(value, copiedThrough);
	while (index !== -1) {
		const before = text[index - 1];
		const after = text[index + value.length];
		if (!isErrorWordCharacter(before) && !isErrorWordCharacter(after)) {
			redacted += text.slice(copiedThrough, index) + REDACTED_ERROR_VALUE;
			copiedThrough = index + value.length;
		}
		index = text.indexOf(value, index + value.length);
	}
	return redacted + text.slice(copiedThrough);
}

function collectRequestValues(
	// `unknown` because caller input may be JSON, form data, or multipart data.
	value: unknown,
	values: Set<string>,
	fieldName = '',
	contentType?: string,
	visited = new WeakSet<object>(),
): void {
	if (typeof value === 'string') {
		if (
			value.length > 0 &&
			(value.length >= 4 || isShortCustomerValueField(fieldName))
		) {
			values.add(value);
		}
		if (fieldName === 'body' && contentType?.includes('application/json')) {
			try {
				// `unknown` because parsed JSON remains untrusted request data.
				const parsed: unknown = JSON.parse(value);
				if (parsed !== null && typeof parsed === 'object') {
					collectRequestValues(parsed, values, fieldName, contentType, visited);
				}
			} catch {
				// Keep the raw request value for redaction when it is not valid JSON.
			}
		} else if (
			fieldName === 'body' &&
			contentType?.includes('application/x-www-form-urlencoded')
		) {
			new URLSearchParams(value).forEach((item, key) =>
				collectRequestValues(item, values, key, contentType, visited),
			);
		}
		return;
	}
	if (typeof value === 'number') {
		const numericValue = String(value);
		if (numericValue.length >= 4 || isShortCustomerValueField(fieldName)) {
			values.add(numericValue);
		}
		return;
	}
	if (value === null || typeof value !== 'object' || visited.has(value)) return;
	visited.add(value);

	if (value instanceof FormData) {
		value.forEach((item, key) =>
			collectRequestValues(item, values, key, contentType, visited),
		);
		return;
	}
	if (value instanceof URLSearchParams) {
		value.forEach((item, key) =>
			collectRequestValues(item, values, key, contentType, visited),
		);
		return;
	}
	if (value instanceof Headers) {
		value.forEach((item, key) =>
			collectRequestValues(item, values, key, contentType, visited),
		);
		return;
	}
	if (Array.isArray(value)) {
		for (const item of value) {
			collectRequestValues(item, values, fieldName, contentType, visited);
		}
		return;
	}
	for (const [key, item] of Object.entries(value)) {
		collectRequestValues(item, values, key, contentType, visited);
	}
}

function redactErrorText(value: string, values: Set<string>): string {
	let redacted = value;
	const redactionValues = new Set<string>();
	for (const sensitiveValue of values) {
		if (sensitiveValue.length === 0) continue;
		redactionValues.add(sensitiveValue);
		const jsonEscapedValue = JSON.stringify(sensitiveValue).slice(1, -1);
		if (jsonEscapedValue !== sensitiveValue) {
			redactionValues.add(jsonEscapedValue);
		}
	}
	for (const sensitiveValue of [...redactionValues].sort(
		(a, b) => b.length - a.length,
	)) {
		redacted =
			sensitiveValue.length < 4
				? redactWholeErrorValue(redacted, sensitiveValue)
				: redacted.split(sensitiveValue).join(REDACTED_ERROR_VALUE);
	}
	return redacted;
}

function redactProviderErrorValue(
	// `unknown` because provider response bodies are untrusted JSON.
	value: unknown,
	values: Set<string>,
	fieldName = '',
): unknown {
	if (isSensitiveErrorField(fieldName)) return REDACTED_ERROR_VALUE;
	if (
		isSafeErrorCodeField(fieldName) &&
		(typeof value === 'string' || typeof value === 'number')
	) {
		return value;
	}
	if (typeof value === 'string') return redactErrorText(value, values);
	if (typeof value === 'number' && values.has(String(value))) {
		return REDACTED_ERROR_VALUE;
	}
	if (value === null || typeof value !== 'object') return value;
	if (Array.isArray(value)) {
		const safeItems = value.map((item) =>
			redactProviderErrorValue(item, values),
		);
		return safeItems.some((item, index) => item !== value[index])
			? safeItems
			: value;
	}

	let changed = false;
	const safeEntries = Object.entries(value).map(([key, item]) => {
		const safeItem = redactProviderErrorValue(item, values, key);
		if (safeItem !== item) changed = true;
		return [key, safeItem];
	});
	return changed ? Object.fromEntries(safeEntries) : value;
}

type PipedriveQueryValue =
	| string
	| number
	| boolean
	| Array<string | number | boolean>
	| undefined;

export async function makePipedriveRequest<T>(
	endpoint: string,
	apiKey: string,
	authType: PipedriveAuthType,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// `unknown` because the operation-specific Zod schema validates JSON, form, or multipart bodies.
		body?: unknown;
		query?: Record<string, PipedriveQueryValue>;
		headers?: Record<string, string>;
		apiVersion?: 'v1' | 'v2';
		contentType?: string;
	} = {},
): Promise<T> {
	if (!apiKey) throw new AuthMissingError('pipedrive', authType);

	const { method = 'GET', body, query } = options;
	const base =
		options.apiVersion === 'v1' ? PIPEDRIVE_API_V1_BASE : PIPEDRIVE_API_BASE;
	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: options.apiVersion === 'v1' ? '1.0.0' : '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		...(authType === 'oauth_2' ? { TOKEN: apiKey } : {}),
		HEADERS: {
			...(body instanceof FormData
				? {}
				: {
						'Content-Type': options.contentType ?? 'application/json',
					}),
			...(authType === 'api_key' ? { 'x-api-token': apiKey } : {}),
			...options.headers,
		},
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'GET' ? undefined : body,
		...(body instanceof FormData || body === undefined
			? {}
			: {
					mediaType: options.contentType ?? 'application/json; charset=utf-8',
				}),
		query,
	};
	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: PIPEDRIVE_RATE_LIMIT_CONFIG,
		});
	} catch (error: unknown) {
		// `unknown` is required because transport failures may be non-Error rejection values.
		if (!(error instanceof ApiError)) throw error;
		const values = new Set<string>();
		if (apiKey) values.add(apiKey);
		collectRequestValues(body, values, 'body', options.contentType);
		collectRequestValues(query, values, 'query');
		collectRequestValues(options.headers, values, 'headers');
		collectRequestValues(
			error.request.body,
			values,
			'body',
			error.request.mediaType,
		);
		collectRequestValues(error.request.query, values, 'query');
		collectRequestValues(error.request.headers, values, 'headers');
		collectRequestValues(error.request.path, values, 'path');
		collectRequestValues(error.request.cookies, values, 'cookies');
		collectRequestValues(error.request.formData, values, 'formData');

		const hasRequestData =
			body !== undefined ||
			query !== undefined ||
			options.headers !== undefined ||
			error.request.body !== undefined ||
			error.request.query !== undefined ||
			error.request.headers !== undefined ||
			error.request.path !== undefined ||
			error.request.cookies !== undefined ||
			error.request.formData !== undefined;
		const safeBody = redactProviderErrorValue(error.body, values);
		const safeMessage = redactErrorText(error.message, values);
		const safeStatusText = redactErrorText(error.statusText, values);
		const safeUrl = error.url.split('?', 1)[0] ?? `${base}${endpoint}`;
		if (
			!hasRequestData &&
			safeBody === error.body &&
			safeMessage === error.message &&
			safeStatusText === error.statusText &&
			safeUrl === error.url
		) {
			throw error;
		}

		const {
			body: _requestBody,
			query: _requestQuery,
			headers: _requestHeaders,
			path: _requestPath,
			cookies: _requestCookies,
			formData: _requestFormData,
			...requestMetadata
		} = error.request;
		void _requestBody;
		void _requestQuery;
		void _requestHeaders;
		void _requestPath;
		void _requestCookies;
		void _requestFormData;
		throw new ApiError(
			{
				...requestMetadata,
				url: requestMetadata.url.split('?', 1)[0] ?? safeUrl,
			},
			{
				url: safeUrl,
				ok: false,
				status: error.status,
				statusText: safeStatusText,
				body: safeBody,
			},
			safeMessage,
			{
				retryAfter: error.retryAfter,
				rateLimitReset: error.rateLimitReset,
				rateLimitRemaining: error.rateLimitRemaining,
				rateLimitLimit: error.rateLimitLimit,
			},
		);
	}
}

const MAX_BINARY_RESPONSE_BYTES = 20 * 1024 * 1024;
const MAX_FILE_REDIRECTS = 5;

function isTrustedPipedriveRedirect(url: URL): boolean {
	return (
		url.protocol === 'https:' &&
		url.port === '' &&
		url.username === '' &&
		url.password === '' &&
		(url.hostname === 'pipedrive.com' ||
			url.hostname.endsWith('.pipedrive.com'))
	);
}

export async function makePipedriveBinaryRequest(
	endpoint: string,
	apiKey: string,
	authType: PipedriveAuthType,
	options: {
		method: 'GET';
		query?: Record<string, PipedriveQueryValue>;
		headers?: Record<string, string>;
		apiVersion: 'v1' | 'v2';
	},
): Promise<{
	content_type: string;
	base64: string;
	byte_length: number;
}> {
	if (!apiKey) throw new AuthMissingError('pipedrive', authType);
	const base =
		options.apiVersion === 'v1' ? PIPEDRIVE_API_V1_BASE : PIPEDRIVE_API_BASE;
	const query = new URLSearchParams();
	for (const [key, value] of Object.entries(options.query ?? {})) {
		if (Array.isArray(value)) {
			for (const item of value) query.append(key, String(item));
		} else if (value !== undefined) {
			query.append(key, String(value));
		}
	}
	const url = `${base}${endpoint}${query.size ? `?${query.toString()}` : ''}`;
	const safeUrl = `${base}${endpoint}`;
	const headers = new Headers({
		Accept: 'application/octet-stream',
		...(authType === 'api_key' ? { 'x-api-token': apiKey } : {}),
		...options.headers,
	});
	if (authType === 'oauth_2') headers.set('Authorization', `Bearer ${apiKey}`);
	try {
		const timeoutSignal = AbortSignal.timeout(20_000);
		const visitedUrls = new Set([url]);
		let currentUrl = url;
		let redirectCount = 0;
		let response: Response | undefined;
		while (!response) {
			const nextResponse = await fetch(currentUrl, {
				method: options.method,
				headers,
				signal: timeoutSignal,
				redirect: 'manual',
			});
			const redirectStatus = [301, 302, 303, 307, 308].includes(
				nextResponse.status,
			);
			const location = redirectStatus
				? nextResponse.headers.get('location')
				: null;
			if (location === null) {
				response = nextResponse;
				continue;
			}
			const nextUrl = new URL(location, currentUrl);
			await nextResponse.body?.cancel().catch(() => undefined);
			if (!isTrustedPipedriveRedirect(nextUrl)) {
				throw new ApiError(
					{ method: options.method, url: endpoint },
					{
						url: safeUrl,
						ok: false,
						status: nextResponse.status,
						statusText: nextResponse.statusText,
						body: { error: 'Pipedrive file download redirect was rejected' },
					},
					'Pipedrive file download redirected outside a trusted Pipedrive origin',
				);
			}
			if (
				redirectCount >= MAX_FILE_REDIRECTS ||
				visitedUrls.has(nextUrl.href)
			) {
				throw new ApiError(
					{ method: options.method, url: endpoint },
					{
						url: safeUrl,
						ok: false,
						status: nextResponse.status,
						statusText: nextResponse.statusText,
						body: { error: 'Pipedrive file download redirect limit reached' },
					},
					'Pipedrive file download exceeded its redirect limit',
				);
			}
			redirectCount += 1;
			visitedUrls.add(nextUrl.href);
			currentUrl = nextUrl.href;
		}
		if (!response.ok) {
			const reset = Number(response.headers.get('x-ratelimit-reset'));
			const retryAfter =
				response.status === 429 && Number.isFinite(reset) && reset > 0
					? reset * 1000
					: undefined;
			await response.body?.cancel().catch(() => undefined);
			throw new ApiError(
				{ method: options.method, url: endpoint },
				{
					url: safeUrl,
					ok: false,
					status: response.status,
					statusText: response.statusText,
					body: { error: 'Pipedrive binary request failed' },
				},
				`Pipedrive request failed with HTTP ${response.status}`,
				retryAfter === undefined ? undefined : { retryAfter },
			);
		}
		const reader = response.body?.getReader();
		const chunks: Uint8Array[] = [];
		let byteLength = 0;
		if (reader) {
			while (true) {
				const chunk = await reader.read();
				if (chunk.done) break;
				byteLength += chunk.value.byteLength;
				if (byteLength > MAX_BINARY_RESPONSE_BYTES) {
					await reader.cancel();
					throw new Error('Pipedrive file exceeds the 20 MiB response limit');
				}
				chunks.push(chunk.value);
			}
		} else {
			const bytes = new Uint8Array(await response.arrayBuffer());
			byteLength = bytes.byteLength;
			if (byteLength > MAX_BINARY_RESPONSE_BYTES) {
				throw new Error('Pipedrive file exceeds the 20 MiB response limit');
			}
			chunks.push(bytes);
		}
		const bytes = new Uint8Array(byteLength);
		let offset = 0;
		for (const chunk of chunks) {
			bytes.set(chunk, offset);
			offset += chunk.byteLength;
		}
		return {
			content_type:
				response.headers.get('content-type')?.split(';', 1)[0] ??
				'application/octet-stream',
			base64: Buffer.from(bytes).toString('base64'),
			byte_length: byteLength,
		};
	} catch (error: unknown) {
		// `unknown` is necessary because fetch can reject with non-Error values.
		if (error instanceof ApiError || error instanceof Error) throw error;
		throw new Error('Pipedrive binary request failed');
	}
}

function hasOAuthRefresh(context: {
	key: string;
}): context is { key: string; _refreshAuth: () => Promise<string> } {
	return (
		'_refreshAuth' in context && typeof context._refreshAuth === 'function'
	);
}

/**
 * Core refreshes an OAuth token after a 401 only for reads. Every Pipedrive
 * endpoint sends a single request, so a write that got a 401 can refresh the
 * token once and send that request again without repeating anything that landed.
 */
export function withOAuthRetry<C extends { key: string }, I, O>(
	endpoint: (ctx: C, input: I) => Promise<O>,
): (ctx: C, input: I) => Promise<O> {
	return async (ctx, input) => {
		try {
			return await endpoint(ctx, input);
		} catch (error: unknown) {
			// `unknown`: transport failures may reject with non-Error values.
			if (
				!(error instanceof ApiError && error.status === 401) ||
				!hasOAuthRefresh(ctx)
			) {
				throw error;
			}
			const freshKey = await ctx._refreshAuth();
			return await endpoint({ ...ctx, key: freshKey }, input);
		}
	};
}
