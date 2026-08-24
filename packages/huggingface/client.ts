import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class HuggingFaceAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'HuggingFaceAPIError';
	}
}

/** Hub REST API host (paths include `/api/...`). */
export const HF_HUB_BASE = 'https://huggingface.co';

/** Datasets Server (rows, stats, search, parquet). */
export const HF_DATASETS_SERVER_BASE = 'https://datasets-server.huggingface.co';

/** Corsair LiteLLM gateway for model-generation calls. */
export const LLM_GATEWAY_BASE = 'https://llm.corsair.dev';

/** Inference Endpoints management API. */
export const HF_ENDPOINTS_BASE = 'https://api.endpoints.huggingface.cloud';

export type HuggingFaceQueryValue =
	| string
	| number
	| boolean
	| string[]
	| undefined;

export type HuggingFaceRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// body shape varies per endpoint; validated by callers via typed Zod input schemas.
	// string = raw body (Hub NDJSON commits: application/x-ndjson).
	body?: Record<string, unknown> | unknown[] | string;
	query?: Record<string, HuggingFaceQueryValue>;
	/** Override base URL (default Hub). */
	baseUrl?: string;
	/** Extra headers (e.g. Accept for XET / resolve). */
	headers?: Record<string, string>;
	/**
	 * When true (default), send Authorization Bearer if token is non-empty.
	 * Public Hub GETs work without a token.
	 */
	bearer?: boolean;
	/** Select raw text/JSON parsing through the fetch-based request path. */
	rawText?: boolean;
	/**
	 * Parse an SSE stream (e.g. `/api/spaces/{ns}/{repo}/events|metrics`) by
	 * collecting `data:` payloads until the stream closes or `timeoutMs`
	 * elapses, then resolve with the array of parsed events. Without this,
	 * `res.text()` blocks forever on the held-open stream and the fetch
	 * aborts with an `AbortError` on timeout.
	 */
	sse?: boolean;
	/** Abort raw fetches after this many milliseconds (default: 30 seconds). */
	timeoutMs?: number;
};

/**
 * HTTP helper for Hugging Face Hub, Datasets Server, and Inference surfaces.
 * Auth: HF user access token or OAuth access token as `Authorization: Bearer`.
 */
export async function makeHuggingFaceRequest<T>(
	endpoint: string,
	accessToken: string | undefined,
	options: HuggingFaceRequestOptions = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		baseUrl = HF_HUB_BASE,
		headers: extraHeaders,
		bearer = true,
		rawText = false,
		sse = false,
		timeoutMs = 30_000,
	} = options;

	const headers: Record<string, string> = {
		Accept: 'application/json',
		...extraHeaders,
	};
	if (
		method === 'POST' ||
		method === 'PUT' ||
		method === 'PATCH' ||
		method === 'DELETE'
	) {
		if (!headers['Content-Type'] && body !== undefined) {
			headers['Content-Type'] = 'application/json';
		}
	}
	if (bearer && accessToken) {
		headers.Authorization = `Bearer ${accessToken}`;
	}

	if (rawText || sse) {
		return rawFetch<T>(
			baseUrl,
			endpoint,
			method,
			headers,
			body,
			query,
			timeoutMs,
			sse,
		);
	}

	const config: OpenAPIConfig = {
		BASE: baseUrl.replace(/\/$/, ''),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: headers,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
		body:
			typeof body === 'string'
				? undefined
				: method === 'POST' ||
						method === 'PUT' ||
						method === 'PATCH' ||
						// HF DELETE secrets/variables/notifications send a JSON body
						(method === 'DELETE' && body !== undefined)
					? // cast: RequestOptions.body is Record | array; ApiRequestOptions.body is Record
						(body as Record<string, unknown>)
					: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: query as Record<string, string | number | boolean | undefined>,
	};
	// Raw string bodies (NDJSON) go through rawFetch — corsair/http JSON-encodes objects only.
	if (typeof body === 'string') {
		return rawFetch<T>(
			baseUrl,
			endpoint,
			method,
			headers,
			body,
			query,
			timeoutMs,
			sse,
		);
	}

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		// Preserve ApiError so error-handlers can inspect status / Retry-After.
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new HuggingFaceAPIError(error.message);
		}
		throw new HuggingFaceAPIError('Unknown Hugging Face API error');
	}
}

async function rawFetch<T>(
	baseUrl: string,
	endpoint: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
	headers: Record<string, string>,
	body: Record<string, unknown> | unknown[] | string | undefined,
	query: Record<string, HuggingFaceQueryValue> | undefined,
	timeoutMs: number,
	sse = false,
): Promise<T> {
	const url = new URL(
		endpoint.startsWith('http')
			? endpoint
			: `${baseUrl.replace(/\/$/, '')}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`,
	);
	if (query) {
		for (const [k, v] of Object.entries(query)) {
			if (v === undefined || v === null) continue;
			if (Array.isArray(v)) {
				for (const item of v) url.searchParams.append(k, String(item));
			} else {
				url.searchParams.set(k, String(v));
			}
		}
	}
	const res = await fetch(url, {
		method,
		headers,
		// HF DELETE secrets/variables/notifications may send a JSON body;
		// commit NDJSON sends a pre-serialized string.
		body:
			body !== undefined && method !== 'GET'
				? typeof body === 'string'
					? body
					: JSON.stringify(body)
				: undefined,
		redirect: 'manual',
		signal: AbortSignal.timeout(timeoutMs),
	});
	if (res.status >= 400) {
		const errorBody = await res.text();
		throw new ApiError(
			{ method, url: endpoint },
			{
				url: url.toString(),
				ok: false,
				status: res.status,
				statusText: res.statusText,
				body: errorBody,
			},
			`Hugging Face request failed: ${res.status}`,
		);
	}
	if (sse) {
		// SSE streams stay open indefinitely; `res.text()` would block until the
		// abort signal fires. Collect `data:` payloads instead, bounded by the
		// same timeout so callers get events rather than an AbortError.
		return readSseStream<T>(res, timeoutMs);
	}
	const text = await res.text();
	// Manual redirects need their status and location even when the body is empty.
	let parsed: unknown = text;
	const location = res.headers.get('location');
	if (res.status >= 300 && res.status < 400) {
		parsed = {
			status: res.status,
			location: location ?? undefined,
			raw: text.slice(0, 2000),
		};
	} else {
		try {
			parsed = text ? JSON.parse(text) : {};
		} catch {
			parsed = {
				status: res.status,
				location: location ?? undefined,
				raw: text.slice(0, 2000),
			};
		}
	}

	// cast: resolve/SSE/raw responses are validated by endpoint Zod output schemas
	return parsed as T;
}

/**
 * Read an SSE response body line-by-line, collecting `data:` payloads until
 * the stream closes or `timeoutMs` elapses. Server-Sent Events streams stay
 * open indefinitely (space runtime events/metrics), so a plain `res.text()`
 * would block until the fetch's abort signal fires and throw an AbortError.
 * `readSseStream` resolves with whatever events arrived before the deadline.
 */
async function readSseStream<T>(res: Response, timeoutMs: number): Promise<T> {
	const events: unknown[] = [];
	const reader = res.body?.getReader();
	if (!reader) {
		return events as T;
	}
	const decoder = new TextDecoder();
	let buffer = '';
	const deadline = Date.now() + timeoutMs;
	try {
		while (Date.now() < deadline) {
			const { done, value } = await reader.read();
			if (done) {
				break;
			}
			buffer += decoder.decode(value, { stream: true });
			let lineEnd: number;
			while ((lineEnd = buffer.indexOf('\n')) !== -1) {
				const line = buffer.slice(0, lineEnd).trim();
				buffer = buffer.slice(lineEnd + 1);
				if (line.startsWith('data:')) {
					const payload = line.slice(5).trim();
					if (payload) {
						try {
							events.push(JSON.parse(payload));
						} catch {
							events.push(payload);
						}
					}
				}
			}
		}
	} catch {
		// Stream closed or aborted by the deadline; return what we collected.
	} finally {
		reader.releaseLock();
	}
	return events as T;
}

/** Split `owner/name` repo ids used across Hub APIs. */
export function splitRepoId(repoId: string): {
	namespace: string;
	repo: string;
} {
	const parts = repoId.split('/');
	if (parts.length < 2 || !parts[0] || !parts[1]) {
		throw new HuggingFaceAPIError(
			`Invalid repoId "${repoId}"; expected "namespace/repo"`,
		);
	}
	return {
		namespace: parts[0],
		repo: parts.slice(1).join('/'),
	};
}

export function encodePath(segment: string): string {
	return segment
		.split('/')
		.map((s) => encodeURIComponent(s))
		.join('/');
}
