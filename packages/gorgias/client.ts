import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { GorgiasOperationDefinition } from './endpoints/definitions';
import type { GorgiasContext } from './index';

const MAX_FILE_BYTES = 20 * 1024 * 1024;
const MAX_UPLOAD_FILES = 10;

export class GorgiasAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'GorgiasAPIError';
	}
}

async function getCredentials(ctx: GorgiasContext): Promise<{
	base: string;
	email: string;
	password: string;
}> {
	const [email, subdomain] = await Promise.all([
		ctx.keys?.get_email(),
		ctx.keys?.get_tenant_external_id(),
	]);
	const apiKey = ctx.key;
	if (!email || !apiKey || !subdomain) {
		throw new AuthMissingError('gorgias', 'api_key');
	}
	if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,62}$/.test(subdomain)) {
		throw new GorgiasAPIError('The configured Gorgias subdomain is invalid.');
	}
	return {
		base: `https://${subdomain}.gorgias.com`,
		email,
		password: apiKey,
	};
}

// `unknown` because parsed operation fields still need runtime narrowing before transport use.
function readSection(
	value: unknown,
	key: string,
): Record<string, unknown> | undefined {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) {
		return undefined;
	}
	const entry = Object.entries(value).find(([name]) => name === key);
	if (
		!entry ||
		typeof entry[1] !== 'object' ||
		entry[1] === null ||
		Array.isArray(entry[1])
	) {
		return undefined;
	}
	const section: Record<string, unknown> = {};
	for (const [name, item] of Object.entries(entry[1])) section[name] = item;
	return section;
}

// `unknown` because request bodies vary by operation and include arrays or JSON objects.
function readField(value: unknown, key: string): unknown {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) {
		return undefined;
	}
	return Object.entries(value).find(([name]) => name === key)?.[1];
}

// `unknown` because multipart entries are narrowed from the generic request body.
function getStringField(value: unknown, key: string): string | undefined {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) {
		return undefined;
	}
	const entry = Object.entries(value).find(([name]) => name === key);
	return typeof entry?.[1] === 'string' ? entry[1] : undefined;
}

function parseRetryAfter(response: Response): number | undefined {
	const value = response.headers.get('retry-after');
	if (!value) return undefined;
	const seconds = Number(value);
	if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
	const timestamp = Date.parse(value);
	return Number.isNaN(timestamp)
		? undefined
		: Math.max(0, timestamp - Date.now());
}

function sanitizeApiError(error: ApiError): ApiError {
	error.message = `Gorgias request failed with HTTP ${error.status}.`;
	error.stack = `${error.name}: ${error.message}`;
	const safeUrl = new URL(error.url);
	safeUrl.search = '';
	safeUrl.hash = '';
	Object.defineProperty(error, 'url', {
		configurable: true,
		value: safeUrl.toString(),
	});
	Object.defineProperty(error, 'statusText', {
		configurable: true,
		value: `HTTP ${error.status}`,
	});
	Object.defineProperty(error, 'body', {
		configurable: true,
		value: '[REDACTED]',
	});
	Object.defineProperty(error, 'request', {
		configurable: true,
		value: {
			method: error.request.method,
			url: error.request.url,
		},
	});
	return error;
}

function decodeBase64(value: string): Uint8Array {
	const binary = atob(value);
	const bytes = new Uint8Array(binary.length);
	for (let index = 0; index < binary.length; index += 1) {
		bytes[index] = binary.charCodeAt(index);
	}
	return bytes;
}

function estimateBase64Size(value: string): number {
	const padding = value.endsWith('==') ? 2 : value.endsWith('=') ? 1 : 0;
	return (value.length * 3) / 4 - padding;
}

function encodeBase64(bytes: Uint8Array): string {
	let binary = '';
	const chunkSize = 0x8000;
	for (let offset = 0; offset < bytes.length; offset += chunkSize) {
		binary += String.fromCharCode(
			...bytes.subarray(offset, offset + chunkSize),
		);
	}
	return btoa(binary);
}

async function readBinaryResponse(response: Response): Promise<{
	kind: 'binary';
	contentType: string;
	base64: string;
	sizeBytes: number;
}> {
	const declaredSize = Number(response.headers.get('content-length'));
	if (Number.isFinite(declaredSize) && declaredSize > MAX_FILE_BYTES) {
		await response.body?.cancel().catch(() => undefined);
		throw new GorgiasAPIError(
			'The Gorgias file exceeds the 20 MiB client limit.',
		);
	}
	const reader = response.body?.getReader();
	if (!reader) {
		return {
			kind: 'binary',
			contentType:
				response.headers.get('content-type') ?? 'application/octet-stream',
			base64: '',
			sizeBytes: 0,
		};
	}
	const chunks: Uint8Array[] = [];
	let sizeBytes = 0;
	try {
		while (true) {
			const chunk = await reader.read();
			if (chunk.done) break;
			sizeBytes += chunk.value.byteLength;
			if (sizeBytes > MAX_FILE_BYTES) {
				await reader.cancel().catch(() => undefined);
				throw new GorgiasAPIError(
					'The Gorgias file exceeds the 20 MiB client limit.',
				);
			}
			chunks.push(chunk.value);
		}
	} finally {
		reader.releaseLock();
	}
	const bytes = new Uint8Array(sizeBytes);
	let offset = 0;
	for (const chunk of chunks) {
		bytes.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return {
		kind: 'binary',
		contentType:
			response.headers.get('content-type') ?? 'application/octet-stream',
		base64: encodeBase64(bytes),
		sizeBytes,
	};
}

// `unknown` because the binary routes share an adapter for distinct parsed input schemas.
async function requestBinary(
	ctx: GorgiasContext,
	definition: GorgiasOperationDefinition,
	input: unknown,
): Promise<unknown> {
	const credentials = await getCredentials(ctx);
	const path = readSection(input, 'path') ?? {};
	const urlPath = definition.path.replace(
		/\{([^}]+)\}/g,
		(_match, name: string) => {
			const value = path[name];
			if (typeof value !== 'string' && typeof value !== 'number') {
				throw new GorgiasAPIError(
					'A required Gorgias path parameter is missing.',
				);
			}
			return encodeURIComponent(String(value));
		},
	);
	const query = readSection(input, 'query') ?? {};
	const url = new URL(`${credentials.base}${urlPath}`);
	for (const [key, value] of Object.entries(query)) {
		if (value === undefined) continue;
		if (Array.isArray(value)) {
			for (const item of value) url.searchParams.append(key, String(item));
		} else if (typeof value === 'object' && value !== null) {
			for (const [childKey, childValue] of Object.entries(value)) {
				url.searchParams.append(`${key}[${childKey}]`, String(childValue));
			}
		} else {
			url.searchParams.append(key, String(value));
		}
	}
	const headers = new Headers({
		Authorization: `Basic ${btoa(`${credentials.email}:${credentials.password}`)}`,
		Accept:
			definition.path.endsWith('/download') ||
			definition.path.includes('/download/')
				? '*/*'
				: 'text/csv',
	});
	const body = readField(input, 'body');
	const init: RequestInit = {
		method: definition.method,
		headers,
		redirect: 'follow',
	};
	if (body !== undefined) {
		init.headers = new Headers({
			...Object.fromEntries(headers.entries()),
			'Content-Type': 'application/json',
		});
		init.body = JSON.stringify(body);
	}
	for (let attempt = 0; attempt < 3; attempt += 1) {
		let response: Response;
		try {
			response = await fetch(url, {
				...init,
				signal: AbortSignal.timeout(20_000),
			});
		} catch {
			throw new GorgiasAPIError('Gorgias file request failed.');
		}
		if (response.ok) return readBinaryResponse(response);
		const retryAfter =
			response.status === 429 ? parseRetryAfter(response) : undefined;
		await response.body?.cancel().catch(() => undefined);
		if (response.status === 429 && attempt < 2) {
			if (retryAfter !== undefined) {
				await new Promise<void>((resolve) => setTimeout(resolve, retryAfter));
			}
			continue;
		}
		throw new GorgiasAPIError(
			`Gorgias file request failed with HTTP ${response.status}.`,
			response.status,
			retryAfter,
		);
	}
	throw new GorgiasAPIError('Gorgias file request failed.');
}

// `unknown` because JSON and binary responses remain provider-controlled until endpoint parsing.
export async function makeGorgiasRequest(
	ctx: GorgiasContext,
	definition: GorgiasOperationDefinition,
	// The operation-specific Zod schema has already parsed this value.
	input: unknown,
): Promise<unknown> {
	if (definition.binary) return requestBinary(ctx, definition, input);
	const credentials = await getCredentials(ctx);
	const config: OpenAPIConfig = {
		BASE: credentials.base,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: 20_000,
		USERNAME: credentials.email,
		PASSWORD: credentials.password,
		// Core defaults to encodeURI, which leaves `/` in string path values (metric card slugs).
		ENCODE_PATH: encodeURIComponent,
	};
	const path = readSection(input, 'path');
	const query = readSection(input, 'query');
	const headers = readSection(input, 'headers');
	let options: ApiRequestOptions = {
		method: definition.method,
		url: definition.path,
		...(path ? { path } : {}),
		...(query ? { query } : {}),
		...(headers ? { headers } : {}),
		mediaType: definition.multipart
			? undefined
			: 'application/json; charset=utf-8',
	};
	if (definition.multipart) {
		const body = readSection(input, 'body');
		const files = body?.files;
		if (!Array.isArray(files) || files.length > MAX_UPLOAD_FILES) {
			throw new GorgiasAPIError('Provide between one and ten files to upload.');
		}
		const form = new FormData();
		let totalBytes = 0;
		for (const file of files) {
			const filename = getStringField(file, 'filename');
			const contentType = getStringField(file, 'contentType');
			const contentBase64 = getStringField(file, 'contentBase64');
			if (!filename || !contentType || contentBase64 === undefined) {
				throw new GorgiasAPIError('A file upload entry is invalid.');
			}
			const estimatedBytes = estimateBase64Size(contentBase64);
			if (
				estimatedBytes > MAX_FILE_BYTES ||
				totalBytes + estimatedBytes > MAX_FILE_BYTES
			) {
				throw new GorgiasAPIError(
					'Uploads are limited to 20 MiB total per request.',
				);
			}
			const bytes = decodeBase64(contentBase64);
			totalBytes += bytes.byteLength;
			form.append(filename, new Blob([bytes], { type: contentType }), filename);
		}
		options = { ...options, body: form };
	} else {
		const body = readField(input, 'body');
		if (body !== undefined) options = { ...options, body };
	}
	try {
		// `unknown` because the provider response remains untrusted until the operation output schema parses it.
		const response: unknown = await request<unknown>(config, options);
		return response;
	} catch (error: unknown) {
		// `unknown` because thrown values from the shared transport are not statically constrained.
		if (error instanceof ApiError) throw sanitizeApiError(error);
		if (error instanceof Error) {
			throw new GorgiasAPIError('Gorgias request failed.');
		}
		throw new GorgiasAPIError('Gorgias request failed.');
	}
}
