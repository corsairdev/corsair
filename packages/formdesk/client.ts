import { AuthMissingError } from 'corsair/core';
import { z } from 'zod';
import type { FormdeskJson } from './endpoints/types';

export const FORMDESK_API_HOST = 'www.formdesk.com';
const MAX_BINARY_BYTES = 25 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 20_000;

export type FormdeskHTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type FormdeskBinary = {
	kind: 'binary';
	contentType: string;
	base64: string;
	filename?: string;
	byteLength: number;
};

export type FormdeskHTTPResult = {
	payload: FormdeskJson | FormdeskBinary;
	creditsRemaining: number | null;
};

export type FormdeskRequestOptions = {
	method: FormdeskHTTPMethod;
	path: string;
	apiKey?: string;
	domain?: string;
	body?: FormdeskJson;
	query?: Record<string, string | number | boolean | undefined>;
	binary?: boolean;
	retryable?: boolean;
};

export class FormdeskAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfterMs?: number,
		public readonly retryable = false,
		public readonly code?: 'TIMEOUT' | 'NETWORK_ERROR',
	) {
		super(message);
		this.name = 'FormdeskAPIError';
	}
}

function parseRetryAfter(value: string | null): number | undefined {
	if (!value) return undefined;
	const seconds = Number(value);
	if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
	const timestamp = Date.parse(value);
	if (Number.isNaN(timestamp)) return undefined;
	return Math.max(0, timestamp - Date.now());
}

function transportError(error: unknown, retryable: boolean): FormdeskAPIError {
	// `unknown` because fetch and stream readers may reject with any value; only
	// standard Error names are inspected, and the original message is not exposed.
	const errorName =
		error instanceof Error
			? error.name
			: typeof error === 'object' &&
					error !== null &&
					'name' in error &&
					typeof error.name === 'string'
				? error.name
				: '';
	const timedOut = errorName === 'TimeoutError' || errorName === 'AbortError';
	return new FormdeskAPIError(
		timedOut
			? 'Formdesk request timed out'
			: 'Formdesk request failed before a response was received',
		undefined,
		undefined,
		retryable,
		timedOut ? 'TIMEOUT' : 'NETWORK_ERROR',
	);
}

function filenameFromHeader(value: string | null): string | undefined {
	if (!value) return undefined;
	const encoded = value.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
	const ordinary = value.match(/filename="?([^";]+)"?/i)?.[1];
	const filename = encoded ? decodeURIComponent(encoded) : ordinary;
	if (!filename) return undefined;
	return filename.replace(/[\\/\r\n]/g, '_');
}

async function readBinary(response: Response): Promise<FormdeskBinary> {
	const declaredLength = Number(response.headers.get('content-length'));
	if (Number.isFinite(declaredLength) && declaredLength > MAX_BINARY_BYTES) {
		await response.body?.cancel().catch(() => undefined);
		throw new FormdeskAPIError('Formdesk binary response exceeds 25 MiB');
	}

	const reader = response.body?.getReader();
	const chunks: Uint8Array[] = [];
	let byteLength = 0;
	if (reader) {
		while (true) {
			const chunk = await reader.read();
			if (chunk.done) break;
			byteLength += chunk.value.byteLength;
			if (byteLength > MAX_BINARY_BYTES) {
				await reader.cancel();
				throw new FormdeskAPIError('Formdesk binary response exceeds 25 MiB');
			}
			chunks.push(chunk.value);
		}
	}
	const bytes = new Uint8Array(byteLength);
	let offset = 0;
	for (const chunk of chunks) {
		bytes.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return {
		kind: 'binary',
		contentType:
			response.headers.get('content-type') ?? 'application/octet-stream',
		base64: Buffer.from(bytes).toString('base64'),
		filename: filenameFromHeader(response.headers.get('content-disposition')),
		byteLength,
	};
}

export async function makeFormdeskRequest(
	host: string,
	options: FormdeskRequestOptions,
): Promise<FormdeskHTTPResult> {
	if (options.apiKey !== undefined && options.apiKey.length === 0) {
		throw new AuthMissingError('formdesk', 'api_key');
	}
	const domainPath = options.domain
		? `/${encodeURIComponent(options.domain)}`
		: '';
	const url = new URL(
		`https://${host}/api/rest/v1${domainPath}${options.path}`,
	);
	for (const [key, value] of Object.entries(options.query ?? {})) {
		if (value !== undefined) url.searchParams.set(key, String(value));
	}
	const headers = new Headers({
		Accept: options.binary ? '*/*' : 'application/json',
	});
	if (options.apiKey) headers.set('Authorization', `Bearer ${options.apiKey}`);
	if (options.body !== undefined)
		headers.set('Content-Type', 'application/json');
	let response: Response;
	try {
		response = await fetch(url, {
			method: options.method,
			headers,
			body:
				options.body === undefined ? undefined : JSON.stringify(options.body),
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch (error: unknown) {
		// `unknown` because fetch can reject with any value; callers only need a
		// stable, credential-free error and safe reads may be retried by Corsair.
		if (error instanceof FormdeskAPIError) throw error;
		throw transportError(error, options.retryable ?? false);
	}

	const creditsHeader = response.headers.get('credits');
	const parsedCredits =
		creditsHeader === null ? Number.NaN : Number(creditsHeader);
	const creditsRemaining = Number.isFinite(parsedCredits)
		? parsedCredits
		: null;
	if (!response.ok) {
		const retryAfterMs = parseRetryAfter(response.headers.get('retry-after'));
		await response.body?.cancel().catch(() => undefined);
		throw new FormdeskAPIError(
			`Formdesk request failed with HTTP ${response.status}`,
			response.status,
			retryAfterMs,
			options.retryable ?? false,
		);
	}
	if (options.binary) {
		try {
			return { payload: await readBinary(response), creditsRemaining };
		} catch (error: unknown) {
			// `unknown` because reading a streamed provider body can fail separately
			// from fetch; preserve plugin errors and sanitize all transport failures.
			if (error instanceof FormdeskAPIError) throw error;
			throw transportError(error, options.retryable ?? false);
		}
	}
	if (response.status === 204) return { payload: null, creditsRemaining };
	// `unknown` because provider JSON is untrusted until the JSON-value schema
	// confirms that it contains only serializable JSON data.
	let body: unknown;
	try {
		body = await response.json();
	} catch (error: unknown) {
		// `unknown` because a response body can fail after headers arrive; keep
		// transport errors sanitized and classifiable like binary read failures.
		if (error instanceof FormdeskAPIError) throw error;
		throw transportError(error, options.retryable ?? false);
	}
	return { payload: z.json().parse(body), creditsRemaining };
}
