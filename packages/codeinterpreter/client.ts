import type { ApiRequestOptions } from 'corsair/http';
import type { OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class CodeInterpreterAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'CodeInterpreterAPIError';
	}
}

export class CodeInterpreterRateLimitError extends CodeInterpreterAPIError {
	constructor(
		message = 'Code Interpreter API rate limit exceeded',
		public readonly retryAfterMs?: number,
	) {
		super(message, 'RATE_LIMITED', 429);
		this.name = 'CodeInterpreterRateLimitError';
	}
}

// The Code Interpreter API is self-hosted; the base URL is provided at runtime.
// This default is used only as a fallback when no base URL is configured.
const DEFAULT_CODEINTERPRETER_API_BASE = 'https://code.librechat.ai';
const REQUEST_TIMEOUT_MS = 120_000;

export function getCodeInterpreterBaseUrl(overrideBaseUrl?: string): string {
	return overrideBaseUrl ?? DEFAULT_CODEINTERPRETER_API_BASE;
}

export async function makeCodeInterpreterRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		baseUrl?: string;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, baseUrl } = options;

	const config: OpenAPIConfig = {
		BASE: getCodeInterpreterBaseUrl(baseUrl),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' || method === 'DELETE' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw new CodeInterpreterAPIError(error.message);
		}
		throw new CodeInterpreterAPIError('Unknown error');
	}
}

/**
 * Upload a file using multipart/form-data via native fetch.
 * The corsair/http `request` helper doesn't natively handle multipart uploads,
 * so we use fetch directly for this endpoint.
 */
export async function makeCodeInterpreterUpload<T>(
	apiKey: string,
	fileData: {
		filename: string;
		content: string; // base64 encoded
		mimeType?: string;
	},
	options: {
		baseUrl?: string;
		sessionId?: string;
	} = {},
): Promise<T> {
	const base = getCodeInterpreterBaseUrl(options.baseUrl);
	const url = new URL('/upload', base);
	if (options.sessionId) {
		url.searchParams.set('session_id', options.sessionId);
	}

	const binaryContent = Buffer.from(fileData.content, 'base64');

	const formData = new FormData();
	const blob = new Blob([binaryContent], {
		type: fileData.mimeType ?? 'application/octet-stream',
	});
	formData.append('file', blob, fileData.filename);

	let res: Response;
	try {
		res = await fetch(url.toString(), {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
			},
			body: formData,
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch (error) {
		if (error instanceof Error && error.name === 'TimeoutError') {
			throw new CodeInterpreterAPIError('Code Interpreter upload timed out');
		}
		throw new CodeInterpreterAPIError(
			error instanceof Error ? error.message : 'Upload failed',
		);
	}

	if (res.status === 429) {
		const retryAfter = res.headers.get('Retry-After');
		const retryAfterMs = retryAfter ? Number(retryAfter) * 1000 : undefined;
		throw new CodeInterpreterRateLimitError(undefined, retryAfterMs);
	}

	if (!res.ok) {
		const text = await res.text();
		throw new CodeInterpreterAPIError(
			text || `Upload failed (${res.status})`,
			undefined,
			res.status,
		);
	}

	return (await res.json()) as T;
}

/**
 * Download a file as base64 content via native fetch.
 */
export async function makeCodeInterpreterDownload(
	endpoint: string,
	apiKey: string,
	options: {
		baseUrl?: string;
	} = {},
): Promise<{ base64: string; contentType: string; filename?: string }> {
	const base = getCodeInterpreterBaseUrl(options.baseUrl);
	const url = new URL(endpoint, base);

	let res: Response;
	try {
		res = await fetch(url.toString(), {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${apiKey}`,
			},
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch (error) {
		if (error instanceof Error && error.name === 'TimeoutError') {
			throw new CodeInterpreterAPIError('Code Interpreter download timed out');
		}
		throw new CodeInterpreterAPIError(
			error instanceof Error ? error.message : 'Download failed',
		);
	}

	if (res.status === 429) {
		throw new CodeInterpreterRateLimitError();
	}

	if (!res.ok) {
		const text = await res.text();
		throw new CodeInterpreterAPIError(
			text || `Download failed (${res.status})`,
			undefined,
			res.status,
		);
	}

	const bytes = Buffer.from(await res.arrayBuffer());
	const contentType =
		res.headers.get('Content-Type') ?? 'application/octet-stream';
	const disposition = res.headers.get('Content-Disposition');
	const filenameMatch = disposition?.match(
		/filename\*?=(?:UTF-8''|"?)([^";]+)/i,
	);
	const filename = filenameMatch?.[1]
		? decodeURIComponent(filenameMatch[1].replace(/"/g, ''))
		: undefined;

	return { base64: bytes.toString('base64'), contentType, filename };
}
