import { AuthMissingError } from 'corsair/core';

export function requireBuildkiteKey(key: string | undefined): string {
	if (!key) {
		throw new AuthMissingError('buildkite', 'api_key');
	}
	return key;
}

export class BuildkiteAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string | number,
		public readonly status?: number,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'BuildkiteAPIError';
	}
}

export class BuildkiteRateLimitError extends BuildkiteAPIError {
	constructor(
		message = 'Too Many Requests',
		public readonly retryAfterMs?: number,
		body?: unknown,
	) {
		super(message, 429, 429, body);
		this.name = 'BuildkiteRateLimitError';
	}
}

const BUILDKITE_API_BASE = 'https://api.buildkite.com';
const REQUEST_TIMEOUT_MS = 20_000;

export type BuildkiteRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	path?: Record<string, string>;
};

function applyPath(template: string, path?: Record<string, string>): string {
	if (!path) return template;
	let out = template;
	for (const [key, value] of Object.entries(path)) {
		out = out.replaceAll(`{${key}}`, encodeURIComponent(value));
	}
	return out;
}

function queryString(
	query?: Record<string, string | number | boolean | undefined>,
): string {
	if (!query) return '';
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) params.set(key, String(value));
	}
	const qs = params.toString();
	return qs ? `?${qs}` : '';
}

function retryAfterMs(res: Response): number | undefined {
	const raw =
		res.headers.get('Retry-After') ?? res.headers.get('RateLimit-Reset');
	if (!raw) return undefined;
	const seconds = Number(raw);
	if (Number.isFinite(seconds)) return seconds * 1000;
	const at = Date.parse(raw);
	return Number.isFinite(at) ? Math.max(0, at - Date.now()) : undefined;
}

function bodyMessage(body: unknown, fallback: string): string {
	if (body && typeof body === 'object' && 'message' in body) {
		return String((body as { message: unknown }).message);
	}
	return fallback;
}

export async function makeBuildkiteRequest<T>(
	endpoint: string,
	apiKey: string | undefined,
	options: BuildkiteRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, path } = options;
	const url = `${BUILDKITE_API_BASE}${applyPath(endpoint, path)}${queryString(query)}`;
	const headers: Record<string, string> = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};
	if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

	let res: Response;
	try {
		res = await fetch(url, {
			method,
			headers,
			body:
				method === 'POST' || method === 'PUT' || method === 'PATCH'
					? JSON.stringify(body)
					: undefined,
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch (error) {
		throw new BuildkiteAPIError(
			error instanceof Error ? error.message : 'Buildkite request failed',
		);
	}

	let parsed: unknown;
	const text = await res.text();
	if (text) {
		try {
			parsed = JSON.parse(text);
		} catch {
			parsed = text;
		}
	}

	if (res.status === 429) {
		throw new BuildkiteRateLimitError(
			bodyMessage(parsed, 'Too Many Requests'),
			retryAfterMs(res),
			parsed,
		);
	}
	if (!res.ok) {
		throw new BuildkiteAPIError(
			bodyMessage(parsed, `Buildkite API error ${res.status}`),
			res.status,
			res.status,
			parsed,
		);
	}
	return parsed as T;
}
