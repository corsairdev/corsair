import { createHmac, randomUUID } from 'node:crypto';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { z } from 'zod';
import type {
	D2lBinaryResponse,
	D2lFileUploadInput,
	D2lFormValue,
	D2lJsonValue,
	D2lRouteInput,
	D2lRouteOutput,
} from './endpoints/types';
import type { D2lRouteDefinition } from './route-definitions';

export type D2lRequestAuth =
	| { kind: 'public' }
	| { kind: 'oauth_2'; accessToken: string }
	| {
			kind: 'api_key';
			applicationId: string;
			applicationKey: string;
			userId: string;
			userKey: string;
	  };

export class D2lBrightspaceAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
		public readonly rateLimitRemaining?: number,
		public readonly rateLimitReset?: number,
	) {
		super(message);
		this.name = 'D2lBrightspaceAPIError';
	}
}

export class D2lBrightspaceConfigurationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'D2lBrightspaceConfigurationError';
	}
}

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'Retry-After' },
};

const MAX_BINARY_RESPONSE_BYTES = 25 * 1024 * 1024;
const MAX_BINARY_REDIRECTS = 5;
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
const MAX_JSON_RESPONSE_BYTES = 10 * 1024 * 1024;
const MAX_JSON_REQUEST_BYTES = 1 * 1024 * 1024;

export function normalizeD2lBrightspaceUrl(value: string): string {
	let parsed: URL;
	try {
		parsed = new URL(value);
	} catch {
		throw new D2lBrightspaceConfigurationError(
			'Brightspace URL must be a valid HTTPS origin.',
		);
	}
	if (
		parsed.protocol !== 'https:' ||
		parsed.username.length > 0 ||
		parsed.password.length > 0 ||
		parsed.search.length > 0 ||
		parsed.hash.length > 0 ||
		(parsed.pathname !== '/' && parsed.pathname.length > 0)
	) {
		throw new D2lBrightspaceConfigurationError(
			'Brightspace URL must be an HTTPS origin without credentials, path, query, or fragment.',
		);
	}
	return parsed.origin;
}

function buildPath(
	route: D2lRouteDefinition,
	pathParams: Record<string, string>,
): string {
	return route.path.replace(/[({]([^){}]+)[)}]/g, (_match, name: string) => {
		const value = pathParams[name];
		if (value === undefined) {
			throw new D2lBrightspaceConfigurationError(
				`Missing path parameter '${name}' for ${route.operationPath}.`,
			);
		}
		return encodeURIComponent(value);
	});
}

function idKeySignature(
	secret: string,
	method: string,
	path: string,
	timestamp: number,
): string {
	const baseString = `${method.toUpperCase()}&${path.toLowerCase()}&${timestamp}`;
	return createHmac('sha256', secret)
		.update(baseString, 'utf8')
		.digest('base64url');
}

function buildIdKeyQuery(
	route: D2lRouteDefinition,
	path: string,
	auth: Extract<D2lRequestAuth, { kind: 'api_key' }>,
	timestamp: number,
): Record<string, string> {
	return {
		x_a: auth.applicationId,
		x_b: auth.userId,
		x_c: idKeySignature(auth.applicationKey, route.method, path, timestamp),
		x_d: idKeySignature(auth.userKey, route.method, path, timestamp),
		x_t: String(timestamp),
	};
}

function isBodyMethod(method: string): boolean {
	return (
		method === 'POST' ||
		method === 'PUT' ||
		method === 'PATCH' ||
		method === 'DELETE'
	);
}

function parseRetryAfterMs(value: string | null): number | undefined {
	if (!value) return undefined;
	const seconds = Number(value);
	if (Number.isFinite(seconds)) return Math.max(0, seconds * 1_000);
	const dateMs = Date.parse(value);
	return Number.isNaN(dateMs) ? undefined : Math.max(0, dateMs - Date.now());
}

function appendQuery(
	url: URL,
	query: Record<string, string | number | boolean | undefined>,
): void {
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) url.searchParams.append(key, String(value));
	}
}

function buildRequestUrl(
	baseUrl: string,
	path: string,
	query: Record<string, string | number | boolean | undefined>,
): URL {
	const url = new URL(path, baseUrl);
	appendQuery(url, query);
	return url;
}

function decodeUploadFile(file: D2lFileUploadInput): Buffer {
	if (file.filename.includes('\r') || file.filename.includes('\n')) {
		throw new D2lBrightspaceConfigurationError(
			'File names must not contain line breaks.',
		);
	}
	if (file.contentType.includes('\r') || file.contentType.includes('\n')) {
		throw new D2lBrightspaceConfigurationError(
			'Content types must not contain line breaks.',
		);
	}
	const bytes = Buffer.from(file.base64, 'base64');
	if (bytes.toString('base64') !== file.base64) {
		throw new D2lBrightspaceConfigurationError(
			'File content must be canonical base64.',
		);
	}
	if (bytes.byteLength > MAX_UPLOAD_BYTES) {
		throw new D2lBrightspaceConfigurationError(
			`Each file is capped at ${MAX_UPLOAD_BYTES} bytes.`,
		);
	}
	return bytes;
}

function fieldNameForFile(route: D2lRouteDefinition, index: number): string {
	const fieldName = route.filePartNames[0];
	if (fieldName === undefined) {
		throw new D2lBrightspaceConfigurationError(
			`No documented file part name is registered for ${route.operationPath}.`,
		);
	}
	return route.filePartNumbered ? `${fieldName} ${index}` : fieldName;
}

function sanitizeDispositionValue(value: string): string {
	return value.split('\r').join('_').split('\n').join('_').split('"').join('_');
}

function appendFormValue(
	form: FormData | URLSearchParams,
	name: string,
	value: D2lFormValue,
): void {
	if (Array.isArray(value)) {
		for (const item of value) form.append(name, String(item));
		return;
	}
	form.append(name, String(value));
}

function serializeJsonBody(body: D2lJsonValue): string {
	const serialized = JSON.stringify(body);
	if (serialized === undefined) {
		throw new D2lBrightspaceConfigurationError(
			'Brightspace JSON request bodies must be serializable JSON values.',
		);
	}
	if (Buffer.byteLength(serialized, 'utf8') > MAX_JSON_REQUEST_BYTES) {
		throw new D2lBrightspaceConfigurationError(
			`Brightspace JSON request bodies are capped at ${MAX_JSON_REQUEST_BYTES} bytes.`,
		);
	}
	return serialized;
}

async function readJsonResponse(response: Response): Promise<D2lRouteOutput> {
	const declaredLength = Number(response.headers.get('content-length'));
	if (
		Number.isFinite(declaredLength) &&
		declaredLength > MAX_JSON_RESPONSE_BYTES
	) {
		await response.body?.cancel().catch(() => undefined);
		throw new D2lBrightspaceConfigurationError(
			`Brightspace JSON response exceeds the ${MAX_JSON_RESPONSE_BYTES}-byte safety limit.`,
		);
	}
	const reader = response.body?.getReader();
	if (!reader) return undefined;
	const chunks: Uint8Array[] = [];
	let size = 0;
	while (true) {
		const chunk = await reader.read();
		if (chunk.done) break;
		size += chunk.value.byteLength;
		if (size > MAX_JSON_RESPONSE_BYTES) {
			await reader.cancel().catch(() => undefined);
			throw new D2lBrightspaceConfigurationError(
				`Brightspace JSON response exceeds the ${MAX_JSON_RESPONSE_BYTES}-byte safety limit.`,
			);
		}
		chunks.push(chunk.value);
	}
	const text = Buffer.concat(
		chunks.map((chunk) => Buffer.from(chunk)),
	).toString('utf8');
	if (text.length === 0) return undefined;
	// `unknown` because parsed provider JSON is untrusted until Zod validates it.
	const responseData: unknown = JSON.parse(text);
	return z.json().parse(responseData);
}

async function makeMultipartD2lRequest(
	route: D2lRouteDefinition,
	path: string,
	baseUrl: string,
	input: D2lRouteInput,
	query: Record<string, string | number | boolean | undefined>,
	headers: Record<string, string>,
	timeoutMs: number,
): Promise<D2lRouteOutput> {
	const signal = AbortSignal.timeout(timeoutMs);
	let body: Buffer;
	let requestHeaders = { ...headers };
	if (route.multipartFormat === 'mixed') {
		const boundary = `corsair-d2l-${randomUUID()}`;
		const parts: Buffer[] = [];
		if (input.body !== undefined) {
			const jsonBody = serializeJsonBody(input.body);
			parts.push(
				Buffer.from(
					`--${boundary}\r\nContent-Type: application/json\r\n\r\n${jsonBody}\r\n`,
					'utf8',
				),
			);
		}
		for (const [index, file] of (input.files ?? []).entries()) {
			const fieldName = sanitizeDispositionValue(
				fieldNameForFile(route, index),
			);
			const filename = sanitizeDispositionValue(file.filename);
			const bytes = decodeUploadFile(file);
			parts.push(
				Buffer.from(
					`--${boundary}\r\nContent-Disposition: form-data; name="${fieldName}"; filename="${filename}"\r\nContent-Type: ${file.contentType}\r\n\r\n`,
					'utf8',
				),
				bytes,
				Buffer.from('\r\n'),
			);
		}
		parts.push(Buffer.from(`--${boundary}--\r\n`, 'utf8'));
		const mixedBody = Buffer.concat(parts);
		if (mixedBody.byteLength > MAX_UPLOAD_BYTES) {
			throw new D2lBrightspaceConfigurationError(
				`Multipart request exceeds the ${MAX_UPLOAD_BYTES}-byte safety limit.`,
			);
		}
		body = mixedBody;
		requestHeaders = {
			...requestHeaders,
			'Content-Type': `multipart/mixed; boundary=${boundary}`,
			'Content-Length': String(mixedBody.byteLength),
		};
	} else {
		const boundary = `corsair-d2l-${randomUUID()}`;
		const parts: Buffer[] = [];
		for (const [name, value] of Object.entries(input.form ?? {})) {
			const values = Array.isArray(value) ? value : [value];
			for (const item of values) {
				parts.push(
					Buffer.from(
						`--${boundary}\r\nContent-Disposition: form-data; name="${sanitizeDispositionValue(name)}"\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${String(item)}\r\n`,
						'utf8',
					),
				);
			}
		}
		for (const [index, file] of (input.files ?? []).entries()) {
			const bytes = decodeUploadFile(file);
			const fieldName = sanitizeDispositionValue(
				fieldNameForFile(route, index),
			);
			const filename = sanitizeDispositionValue(file.filename);
			parts.push(
				Buffer.from(
					`--${boundary}\r\nContent-Disposition: form-data; name="${fieldName}"; filename="${filename}"\r\nContent-Type: ${file.contentType}\r\n\r\n`,
					'utf8',
				),
				bytes,
				Buffer.from('\r\n'),
			);
		}
		parts.push(Buffer.from(`--${boundary}--\r\n`, 'utf8'));
		body = Buffer.concat(parts);
		if (body.byteLength > MAX_UPLOAD_BYTES) {
			throw new D2lBrightspaceConfigurationError(
				`Multipart request exceeds the ${MAX_UPLOAD_BYTES}-byte safety limit.`,
			);
		}
		requestHeaders = {
			...requestHeaders,
			'Content-Type': `multipart/form-data; boundary=${boundary}`,
			'Content-Length': String(body.byteLength),
		};
	}
	const response = await fetch(buildRequestUrl(baseUrl, path, query), {
		method: route.method,
		headers: requestHeaders,
		body,
		credentials: 'omit',
		redirect: 'manual',
		signal,
	});
	if (response.status >= 300 && response.status < 400) {
		await response.body?.cancel().catch(() => undefined);
		throw new D2lBrightspaceAPIError(
			`Brightspace upload request returned HTTP ${response.status}.`,
			response.status,
			parseRetryAfterMs(response.headers.get('retry-after')),
		);
	}
	if (!response.ok) {
		const retryAfter = parseRetryAfterMs(response.headers.get('retry-after'));
		await response.body?.cancel().catch(() => undefined);
		throw new D2lBrightspaceAPIError(
			`Brightspace API returned HTTP ${response.status}.`,
			response.status,
			retryAfter,
		);
	}
	return readJsonResponse(response);
}

async function makeFormD2lRequest(
	route: D2lRouteDefinition,
	path: string,
	baseUrl: string,
	input: D2lRouteInput,
	query: Record<string, string | number | boolean | undefined>,
	headers: Record<string, string>,
	timeoutMs: number,
): Promise<D2lRouteOutput> {
	if (route.formFields.length === 0) {
		throw new D2lBrightspaceConfigurationError(
			`The documented form fields for ${route.operationPath} are not fully enumerated yet.`,
		);
	}
	const body = new URLSearchParams();
	for (const [name, value] of Object.entries(input.form ?? {})) {
		appendFormValue(body, name, value);
	}
	const response = await fetch(buildRequestUrl(baseUrl, path, query), {
		method: route.method,
		headers: {
			...headers,
			'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
		},
		body,
		credentials: 'omit',
		redirect: 'manual',
		signal: AbortSignal.timeout(timeoutMs),
	});
	if (response.status >= 300 && response.status < 400) {
		await response.body?.cancel().catch(() => undefined);
		throw new D2lBrightspaceAPIError(
			`Brightspace form request returned HTTP ${response.status}.`,
			response.status,
			parseRetryAfterMs(response.headers.get('retry-after')),
		);
	}
	if (!response.ok) {
		const retryAfter = parseRetryAfterMs(response.headers.get('retry-after'));
		await response.body?.cancel().catch(() => undefined);
		throw new D2lBrightspaceAPIError(
			`Brightspace API returned HTTP ${response.status}.`,
			response.status,
			retryAfter,
		);
	}
	return readJsonResponse(response);
}

const UPLOAD_CHUNK_BYTES = 4 * 1024 * 1024;

function authorizeUploadUrl(
	url: URL,
	route: D2lRouteDefinition,
	auth: D2lRequestAuth,
	timestamp: number,
): URL {
	if (auth.kind === 'api_key') {
		for (const name of ['x_a', 'x_b', 'x_c', 'x_d', 'x_t']) {
			url.searchParams.delete(name);
		}
		for (const [name, value] of Object.entries(
			buildIdKeyQuery(route, url.pathname, auth, timestamp),
		)) {
			url.searchParams.append(name, value);
		}
	}
	return url;
}

async function postUploadChunk(
	url: URL,
	route: D2lRouteDefinition,
	auth: D2lRequestAuth,
	baseUrl: string,
	file: D2lFileUploadInput,
	bytes: Buffer,
	start: number,
	endExclusive: number,
	timeoutMs: number,
): Promise<Response> {
	const total = bytes.byteLength;
	const timestamp = Math.floor(Date.now() / 1000);
	const authorizedUrl = authorizeUploadUrl(
		new URL(url),
		route,
		auth,
		timestamp,
	);
	const startHeader = endExclusive === total ? String(total) : String(total);
	const headers: Record<string, string> = {
		Accept: '*/*',
		'Content-Type': file.contentType,
		'Content-Range': `bytes ${start}-${endExclusive - 1}/${startHeader}`,
		...(auth.kind === 'oauth_2'
			? { Authorization: `Bearer ${auth.accessToken}` }
			: {}),
	};
	if (authorizedUrl.origin !== new URL(baseUrl).origin) {
		throw new D2lBrightspaceConfigurationError(
			'Brightspace upload URLs must remain on the configured HTTPS origin.',
		);
	}
	return fetch(authorizedUrl, {
		method: 'POST',
		headers,
		body: bytes.subarray(start, endExclusive),
		credentials: 'omit',
		redirect: 'manual',
		signal: AbortSignal.timeout(timeoutMs),
	});
}

async function readUploadRange(response: Response): Promise<number> {
	const value = response.headers.get('range');
	await response.body?.cancel().catch(() => undefined);
	if (!value) {
		throw new D2lBrightspaceAPIError(
			'Brightspace resumable upload did not return the documented Range header.',
			response.status,
			parseRetryAfterMs(response.headers.get('retry-after')),
		);
	}
	const match = value.match(/(?:bytes=)?\d+-(\d+)$/i);
	if (!match) {
		throw new D2lBrightspaceAPIError(
			'Brightspace resumable upload returned an invalid Range header.',
			response.status,
			parseRetryAfterMs(response.headers.get('retry-after')),
		);
	}
	return Number(match[1]) + 1;
}

async function makeResumableD2lRequest(
	route: D2lRouteDefinition,
	path: string,
	baseUrl: string,
	input: D2lRouteInput,
	query: Record<string, string | number | boolean | undefined>,
	headers: Record<string, string>,
	auth: D2lRequestAuth,
	timeoutMs: number,
): Promise<D2lRouteOutput> {
	const file = input.upload;
	if (!file) {
		throw new D2lBrightspaceConfigurationError(
			`A file is required for the resumable upload on ${route.operationPath}.`,
		);
	}
	const bytes = decodeUploadFile(file);
	if (bytes.byteLength === 0) {
		throw new D2lBrightspaceConfigurationError(
			'Empty files are not supported by the resumable upload helper.',
		);
	}
	const serializedBody =
		input.body === undefined ? undefined : serializeJsonBody(input.body);
	const startHeaders: Record<string, string> = {
		...headers,
		'X-Upload-Content-Type': file.contentType,
		'X-Upload-Content-Length': String(bytes.byteLength),
		'X-Upload-File-Name': file.filename,
		'Content-Length': String(
			serializedBody === undefined
				? 0
				: Buffer.byteLength(serializedBody, 'utf8'),
		),
		...(input.body !== undefined
			? { 'Content-Type': 'application/json; charset=utf-8' }
			: {}),
	};
	const initialResponse = await fetch(buildRequestUrl(baseUrl, path, query), {
		method: route.method,
		headers: startHeaders,
		...(serializedBody !== undefined ? { body: serializedBody } : {}),
		credentials: 'omit',
		redirect: 'manual',
		signal: AbortSignal.timeout(timeoutMs),
	});
	if (initialResponse.status !== 308) {
		if (!initialResponse.ok) {
			const retryAfter = parseRetryAfterMs(
				initialResponse.headers.get('retry-after'),
			);
			await initialResponse.body?.cancel().catch(() => undefined);
			throw new D2lBrightspaceAPIError(
				`Brightspace API returned HTTP ${initialResponse.status}.`,
				initialResponse.status,
				retryAfter,
			);
		}
		return readJsonResponse(initialResponse);
	}
	const location = initialResponse.headers.get('location');
	await initialResponse.body?.cancel().catch(() => undefined);
	if (!location) {
		throw new D2lBrightspaceAPIError(
			'Brightspace resumable upload did not return its documented Location header.',
			308,
		);
	}
	const uploadUrl = new URL(location, baseUrl);
	if (uploadUrl.origin !== new URL(baseUrl).origin) {
		throw new D2lBrightspaceConfigurationError(
			'Brightspace upload URLs must remain on the configured HTTPS origin.',
		);
	}
	const uploadKey = decodeURIComponent(
		uploadUrl.pathname.split('/').filter(Boolean).at(-1) ?? '',
	);
	if (!uploadKey) {
		throw new D2lBrightspaceAPIError(
			'Brightspace returned an invalid upload key.',
			308,
		);
	}
	let uploadedBytes = 0;
	let needsStatusCheck = false;
	while (uploadedBytes < bytes.byteLength) {
		const next = Math.min(uploadedBytes + UPLOAD_CHUNK_BYTES, bytes.byteLength);
		const response = await postUploadChunk(
			uploadUrl,
			route,
			auth,
			baseUrl,
			file,
			bytes,
			uploadedBytes,
			next,
			timeoutMs,
		);
		if (response.status === 200) {
			await response.body?.cancel().catch(() => undefined);
			uploadedBytes = bytes.byteLength;
			needsStatusCheck = false;
			break;
		}
		if (response.status !== 308) {
			const retryAfter = parseRetryAfterMs(response.headers.get('retry-after'));
			await response.body?.cancel().catch(() => undefined);
			throw new D2lBrightspaceAPIError(
				`Brightspace upload data request returned HTTP ${response.status}.`,
				response.status,
				retryAfter,
			);
		}
		const nextOffset = await readUploadRange(response);
		if (nextOffset <= uploadedBytes || nextOffset > bytes.byteLength) {
			throw new D2lBrightspaceAPIError(
				'Brightspace resumable upload returned an invalid received byte range.',
				308,
			);
		}
		uploadedBytes = nextOffset;
		needsStatusCheck = true;
	}
	if (needsStatusCheck) {
		const statusUrl = authorizeUploadUrl(
			new URL(uploadUrl),
			route,
			auth,
			Math.floor(Date.now() / 1000),
		);
		const statusResponse = await fetch(statusUrl, {
			method: 'POST',
			headers: {
				Accept: '*/*',
				'Content-Type': file.contentType,
				'Content-Range': `bytes */${bytes.byteLength}`,
				...(auth.kind === 'oauth_2'
					? { Authorization: `Bearer ${auth.accessToken}` }
					: {}),
			},
			credentials: 'omit',
			redirect: 'manual',
			signal: AbortSignal.timeout(timeoutMs),
		});
		if (statusResponse.status !== 200) {
			const retryAfter = parseRetryAfterMs(
				statusResponse.headers.get('retry-after'),
			);
			await statusResponse.body?.cancel().catch(() => undefined);
			throw new D2lBrightspaceAPIError(
				`Brightspace upload status check returned HTTP ${statusResponse.status}.`,
				statusResponse.status,
				retryAfter,
			);
		}
		await statusResponse.body?.cancel().catch(() => undefined);
	}
	if (route.routeId !== 'd2l0056') {
		return { kind: 'upload_session', fileKey: uploadKey, uploadedBytes };
	}
	if (
		!input.body ||
		typeof input.body !== 'object' ||
		Array.isArray(input.body)
	) {
		throw new D2lBrightspaceConfigurationError(
			'The ePortfolio file-artifact upload requires a JSON object to create the artifact.',
		);
	}
	return makeD2lBrightspaceRequest(
		route,
		{
			...input,
			body: { ...input.body, UploadKey: uploadKey },
			upload: undefined,
		},
		baseUrl,
		auth,
		timeoutMs,
	);
}

async function readBinaryBody(response: Response): Promise<D2lBinaryResponse> {
	const declaredLength = Number(response.headers.get('content-length'));
	if (
		Number.isFinite(declaredLength) &&
		declaredLength > MAX_BINARY_RESPONSE_BYTES
	) {
		await response.body?.cancel().catch(() => undefined);
		throw new D2lBrightspaceConfigurationError(
			`Brightspace binary response exceeds the ${MAX_BINARY_RESPONSE_BYTES}-byte safety limit.`,
		);
	}
	const reader = response.body?.getReader();
	const chunks: Uint8Array[] = [];
	let sizeBytes = 0;
	if (reader) {
		while (true) {
			const chunk = await reader.read();
			if (chunk.done) break;
			sizeBytes += chunk.value.byteLength;
			if (sizeBytes > MAX_BINARY_RESPONSE_BYTES) {
				await reader.cancel().catch(() => undefined);
				throw new D2lBrightspaceConfigurationError(
					`Brightspace binary response exceeds the ${MAX_BINARY_RESPONSE_BYTES}-byte safety limit.`,
				);
			}
			chunks.push(chunk.value);
		}
	}
	const bytes = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
	return {
		kind: 'binary',
		contentType:
			response.headers.get('content-type') ?? 'application/octet-stream',
		base64: bytes.toString('base64'),
		sizeBytes,
	};
}

async function makeBinaryD2lRequest(
	route: D2lRouteDefinition,
	path: string,
	baseUrl: string,
	query: Record<string, string | number | boolean | undefined>,
	headers: Record<string, string>,
	auth: D2lRequestAuth,
	timeoutMs: number,
): Promise<D2lRouteOutput> {
	const base = new URL(baseUrl);
	let currentUrl = new URL(path, base);
	appendQuery(currentUrl, query);
	const signal = AbortSignal.timeout(timeoutMs);
	for (
		let redirectCount = 0;
		redirectCount <= MAX_BINARY_REDIRECTS;
		redirectCount += 1
	) {
		const response = await fetch(currentUrl, {
			method: route.method,
			headers,
			credentials: 'omit',
			redirect: 'manual',
			signal,
		});
		if (response.status >= 300 && response.status < 400) {
			const location = response.headers.get('location');
			await response.body?.cancel().catch(() => undefined);
			if (!location || redirectCount === MAX_BINARY_REDIRECTS) {
				throw new D2lBrightspaceAPIError(
					'Brightspace returned an unusable file redirect.',
					response.status,
					parseRetryAfterMs(response.headers.get('retry-after')),
				);
			}
			const nextUrl = new URL(location, currentUrl);
			if (nextUrl.origin !== base.origin) {
				throw new D2lBrightspaceAPIError(
					'Brightspace returned a cross-origin file redirect; credentials were not forwarded.',
					response.status,
					parseRetryAfterMs(response.headers.get('retry-after')),
				);
			}
			if (auth.kind === 'api_key') {
				for (const key of ['x_a', 'x_b', 'x_c', 'x_d', 'x_t']) {
					nextUrl.searchParams.delete(key);
				}
				appendQuery(
					nextUrl,
					buildIdKeyQuery(
						route,
						nextUrl.pathname,
						auth,
						Math.floor(Date.now() / 1000),
					),
				);
			}
			currentUrl = nextUrl;
			continue;
		}
		if (!response.ok) {
			const retryAfter = parseRetryAfterMs(response.headers.get('retry-after'));
			await response.body?.cancel().catch(() => undefined);
			throw new D2lBrightspaceAPIError(
				`Brightspace API returned HTTP ${response.status}.`,
				response.status,
				retryAfter,
			);
		}
		if (
			route.responseMode === 'binary_or_json' &&
			response.headers.get('content-type')?.toLowerCase().includes('json')
		) {
			// `unknown` because response.json() is untrusted provider data; z.json() narrows it.
			const responseData: unknown = await response.json();
			return z.json().parse(responseData);
		}
		return await readBinaryBody(response);
	}
	throw new D2lBrightspaceAPIError('Brightspace file redirect limit exceeded.');
}

export async function makeD2lBrightspaceRequest(
	route: D2lRouteDefinition,
	input: D2lRouteInput,
	baseUrl: string,
	auth: D2lRequestAuth,
	timeoutMs = 20_000,
): Promise<D2lRouteOutput> {
	const base = normalizeD2lBrightspaceUrl(baseUrl);
	const path = buildPath(route, input.pathParams);
	const publicVersionRoute =
		route.group === 'API properties' &&
		route.path.startsWith('/d2l/api/') &&
		route.path.includes('/versions');
	const timestamp = Math.floor(Date.now() / 1000);
	const legacyQuery =
		auth.kind === 'api_key' && !publicVersionRoute
			? buildIdKeyQuery(route, path, auth, timestamp)
			: {};
	const query = { ...input.query, ...legacyQuery };
	const headers: Record<string, string> = {
		Accept: route.responseMode === 'json' ? 'application/json' : '*/*',
		...(auth.kind === 'oauth_2' && !publicVersionRoute
			? { Authorization: `Bearer ${auth.accessToken}` }
			: {}),
	};
	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: timeoutMs,
		HEADERS: headers,
	};
	const requestOptions: ApiRequestOptions = {
		method: route.method,
		url: path,
		...(isBodyMethod(route.method) && input.body !== undefined
			? { body: input.body, mediaType: 'application/json; charset=utf-8' }
			: {}),
		...(Object.keys(query).length > 0 ? { query } : {}),
	};
	if (route.requestMode === 'json' && input.body !== undefined) {
		serializeJsonBody(input.body);
	}
	if (
		route.requestMode === 'resumable' &&
		(route.routeId !== 'd2l0056' || input.upload !== undefined)
	) {
		return makeResumableD2lRequest(
			route,
			path,
			base,
			input,
			query,
			headers,
			auth,
			timeoutMs,
		);
	}
	if (route.requestMode === 'multipart') {
		return makeMultipartD2lRequest(
			route,
			path,
			base,
			input,
			query,
			headers,
			timeoutMs,
		);
	}
	if (route.requestMode === 'form') {
		return makeFormD2lRequest(
			route,
			path,
			base,
			input,
			query,
			headers,
			timeoutMs,
		);
	}
	if (route.responseMode !== 'json') {
		return makeBinaryD2lRequest(
			route,
			path,
			base,
			query,
			headers,
			auth,
			timeoutMs,
		);
	}

	try {
		return await request<D2lRouteOutput>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error: unknown) {
		// `unknown` because transport and fetch failures have no common static error type.
		if (error instanceof ApiError) {
			throw new D2lBrightspaceAPIError(
				`Brightspace API returned HTTP ${error.status}.`,
				error.status,
				error.retryAfter,
				error.rateLimitRemaining,
				error.rateLimitReset,
			);
		}
		throw new D2lBrightspaceAPIError('Brightspace API request failed.');
	}
}
