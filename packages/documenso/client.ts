import { AuthMissingError } from 'corsair/core';
import type { DocumensoOperationName } from './endpoints/definitions';
import { DocumensoOperationDefinitions } from './endpoints/definitions';

const DEFAULT_TIMEOUT_MS = 20_000;
const TRANSFER_TIMEOUT_MS = 120_000;
const MAX_DOWNLOAD_BYTES = 20 * 1024 * 1024;
const MAX_UPLOAD_BYTES = 16 * 1024 * 1024;
const MAX_UPLOAD_TOTAL_BYTES = 32 * 1024 * 1024;

export class DocumensoAPIError extends Error {
	constructor(
		message: string,
		public readonly status: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'DocumensoAPIError';
	}
}

export type DocumensoRequestContext = {
	key: string;
	baseUrl?: string;
};

function normalizedBaseUrl(baseUrl?: string): string {
	const candidate = baseUrl ?? 'https://app.documenso.com/api/v2';
	let parsed: URL;
	try {
		parsed = new URL(candidate);
	} catch {
		throw new DocumensoAPIError(
			'Documenso base URL must be an absolute HTTP(S) URL',
			0,
		);
	}
	if (
		(parsed.protocol !== 'https:' && parsed.protocol !== 'http:') ||
		parsed.username ||
		parsed.password ||
		parsed.search ||
		parsed.hash
	) {
		throw new DocumensoAPIError(
			'Documenso base URL must be an HTTP(S) URL without credentials, query, or fragment',
			0,
		);
	}
	const localHttpHosts = new Set(['localhost', '127.0.0.1', '[::1]']);
	if (
		parsed.protocol === 'http:' &&
		!localHttpHosts.has(parsed.hostname.toLowerCase())
	) {
		throw new DocumensoAPIError(
			'Documenso base URL must use HTTPS except for localhost loopback',
			0,
		);
	}
	return parsed.toString().replace(/\/$/, '');
}

function retryAfterMs(response: Response): number | undefined {
	const header = response.headers.get('retry-after');
	if (header === null) return undefined;
	const seconds = Number(header);
	return Number.isFinite(seconds) && seconds >= 0 ? seconds * 1000 : undefined;
}

function responseMediaType(response: Response): string {
	return (
		(response.headers.get('content-type') ?? 'application/pdf')
			.split(';', 1)[0]
			?.trim()
			.toLowerCase() || 'application/pdf'
	);
}

// `unknown` is necessary for provider-defined JSON values inside the already-parsed input object; path and query values are narrowed before use.
function routeUrl(
	baseUrl: string,
	operationName: DocumensoOperationName,
	input: Record<string, unknown>,
): URL {
	const definition = DocumensoOperationDefinitions[operationName];
	let route: string = definition.path;
	for (const name of definition.pathTokens) {
		const value = input[name];
		if (typeof value !== 'string' && typeof value !== 'number') {
			throw new DocumensoAPIError(
				`Missing Documenso path parameter: ${name}`,
				0,
			);
		}
		route = route.replace(`{${name}}`, encodeURIComponent(String(value)));
	}
	const url = new URL(`${baseUrl}${route}`);
	for (const name of definition.queryParams) {
		const value = input[name];
		if (
			typeof value === 'string' ||
			typeof value === 'number' ||
			typeof value === 'boolean'
		) {
			url.searchParams.set(name, String(value));
		}
	}
	return url;
}

function requestBody(
	operationName: DocumensoOperationName,
	// `unknown` is necessary for nested free-form JSON fields allowed by Documenso's OpenAPI schema.
	input: Record<string, unknown>,
): Record<string, unknown> {
	// `unknown` preserves documented arbitrary JSON fields without pretending they have a narrower transport type.
	const body: Record<string, unknown> = {};
	for (const name of DocumensoOperationDefinitions[operationName].bodyKeys) {
		const value = input[name];
		if (value !== undefined) body[name] = value;
	}
	return body;
}

// Errors name the field, never the caller's filename: filenames often carry signer or customer names.
function decodeBase64(value: string, fieldName: string): Uint8Array {
	const maxEncodedLength = Math.ceil(MAX_UPLOAD_BYTES / 3) * 4;
	if (value.length > maxEncodedLength) {
		throw new DocumensoAPIError(
			`Upload in ${fieldName} exceeds the ${MAX_UPLOAD_BYTES}-byte plugin limit`,
			0,
		);
	}
	let decoded: string;
	try {
		decoded = atob(value);
	} catch {
		throw new DocumensoAPIError(
			`Upload in ${fieldName} is not valid base64`,
			0,
		);
	}
	if (decoded.length > MAX_UPLOAD_BYTES) {
		throw new DocumensoAPIError(
			`Upload in ${fieldName} exceeds the ${MAX_UPLOAD_BYTES}-byte plugin limit`,
			0,
		);
	}
	return Uint8Array.from(decoded, (character) => character.charCodeAt(0));
}

// `unknown` because file entries arrive from runtime input; the endpoint's strict Zod schema has already checked them, and this guard repeats the boundary check defensively.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function appendUpload(
	form: FormData,
	fieldName: string,
	// `unknown` is the runtime multipart value; its strict generated Zod schema and this guard validate the file shape before encoding.
	value: unknown,
	uploadedBytes: number,
): number {
	const candidates = Array.isArray(value) ? value : [value];
	let totalBytes = uploadedBytes;
	for (const candidate of candidates) {
		if (!isRecord(candidate))
			throw new DocumensoAPIError('Invalid upload file', 0);
		const filename = candidate.filename;
		const contentType = candidate.contentType;
		const contentBase64 = candidate.contentBase64;
		if (
			typeof filename !== 'string' ||
			typeof contentType !== 'string' ||
			typeof contentBase64 !== 'string'
		) {
			throw new DocumensoAPIError('Invalid upload file', 0);
		}
		const bytes = decodeBase64(contentBase64, fieldName);
		totalBytes += bytes.byteLength;
		if (totalBytes > MAX_UPLOAD_TOTAL_BYTES) {
			throw new DocumensoAPIError(
				`Multipart uploads exceed the ${MAX_UPLOAD_TOTAL_BYTES}-byte plugin limit`,
				0,
			);
		}
		form.append(fieldName, new Blob([bytes], { type: contentType }), filename);
	}
	return totalBytes;
}

// `unknown` is necessary because payload values include documented free-form JSON; the endpoint schema validates the payload before multipart serialization.
function multipartBody(body: Record<string, unknown>): FormData {
	const form = new FormData();
	let uploadedBytes = 0;
	for (const [fieldName, value] of Object.entries(body)) {
		if (fieldName === 'payload') {
			form.append('payload', JSON.stringify(value));
		} else if (fieldName === 'file' || fieldName === 'files') {
			uploadedBytes = appendUpload(form, fieldName, value, uploadedBytes);
		}
	}
	return form;
}

// `unknown` because PDF bytes are converted to a response value and validated against the operation's binary output schema by the endpoint.
async function binaryResponse(response: Response): Promise<unknown> {
	const declaredLength = Number(response.headers.get('content-length'));
	if (Number.isFinite(declaredLength) && declaredLength > MAX_DOWNLOAD_BYTES) {
		await response.body?.cancel().catch(() => undefined);
		throw new DocumensoAPIError(
			`PDF download exceeds the ${MAX_DOWNLOAD_BYTES}-byte plugin limit`,
			response.status,
		);
	}
	if (!response.body) {
		return {
			kind: 'binary',
			contentType: responseMediaType(response),
			base64: '',
			size: 0,
		};
	}
	const reader = response.body.getReader();
	const chunks: Uint8Array[] = [];
	let total = 0;
	while (true) {
		let done: boolean;
		let value: Uint8Array | undefined;
		try {
			const chunk = await reader.read();
			done = chunk.done;
			value = chunk.value;
		} catch {
			await reader.cancel().catch(() => undefined);
			throw new DocumensoAPIError(
				'Documenso PDF response body failed or timed out',
				0,
			);
		}
		if (done) break;
		if (!value) continue;
		total += value.byteLength;
		if (total > MAX_DOWNLOAD_BYTES) {
			await reader.cancel().catch(() => undefined);
			throw new DocumensoAPIError(
				`PDF download exceeds the ${MAX_DOWNLOAD_BYTES}-byte plugin limit`,
				response.status,
			);
		}
		chunks.push(value);
	}
	const bytes = new Uint8Array(total);
	let offset = 0;
	for (const chunk of chunks) {
		bytes.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return {
		kind: 'binary',
		contentType: responseMediaType(response),
		base64: Buffer.from(bytes).toString('base64'),
		size: total,
	};
}

/**
 * Calls a documented Documenso v2 operation. Response bodies are deliberately
 * not attached to thrown errors: provider messages may echo payload data or
 * signing tokens, while the status and Retry-After are sufficient for handling.
 */
export async function makeDocumensoRequest(
	operationName: DocumensoOperationName,
	context: DocumensoRequestContext,
	// `unknown` is necessary for nested free-form JSON fields allowed by the operation-specific Zod input schema.
	input: Record<string, unknown>,
): Promise<unknown> {
	// `unknown` is the response boundary: the operation-specific output Zod schema narrows it before the endpoint returns it.
	if (!context.key.trim()) throw new AuthMissingError('documenso', 'api_key');
	const definition = DocumensoOperationDefinitions[operationName];
	const url = routeUrl(
		normalizedBaseUrl(context.baseUrl),
		operationName,
		input,
	);
	const headers = new Headers({
		Authorization: context.key.replace(/[\r\n]/g, ''),
	});
	const body = requestBody(operationName, input);
	let requestBodyValue: RequestInit['body'];
	if (definition.bodyMedia === 'multipart/form-data') {
		requestBodyValue = multipartBody(body);
	} else if (definition.bodyMedia === 'application/json') {
		headers.set('Content-Type', 'application/json');
		requestBodyValue = JSON.stringify(body);
	}

	let response: Response;
	const timeoutMs =
		definition.binaryUpload || definition.binaryDownload
			? TRANSFER_TIMEOUT_MS
			: DEFAULT_TIMEOUT_MS;
	try {
		response = await fetch(url, {
			method: definition.method,
			headers,
			body: requestBodyValue,
			credentials: 'omit',
			signal: AbortSignal.timeout(timeoutMs),
		});
	} catch {
		throw new DocumensoAPIError('Documenso request failed or timed out', 0);
	}

	if (!response.ok) {
		const status = response.status;
		const retryAfter = retryAfterMs(response);
		await response.body?.cancel().catch(() => undefined);
		throw new DocumensoAPIError(
			`Documenso API request failed with HTTP ${status}`,
			status,
			retryAfter,
		);
	}
	if (definition.binaryDownload) return binaryResponse(response);

	try {
		const body: unknown = await response.json();
		return body;
	} catch {
		throw new DocumensoAPIError(
			'Documenso returned an invalid JSON response',
			response.status,
		);
	}
}

export const DOCUMENSO_REQUEST_TIMEOUT_MS = DEFAULT_TIMEOUT_MS;
export const DOCUMENSO_TRANSFER_TIMEOUT_MS = TRANSFER_TIMEOUT_MS;
export const DOCUMENSO_MAX_DOWNLOAD_BYTES = MAX_DOWNLOAD_BYTES;
export const DOCUMENSO_MAX_UPLOAD_BYTES = MAX_UPLOAD_BYTES;
export const DOCUMENSO_MAX_UPLOAD_TOTAL_BYTES = MAX_UPLOAD_TOTAL_BYTES;
