import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { z } from 'zod';

export const FREEAGENT_API_BASE = 'https://api.freeagent.com';
export const FREEAGENT_SANDBOX_API_BASE = 'https://api.sandbox.freeagent.com';

export const FreeAgentPaginationHeadersSchema = z.object({
	link: z.string().nullable(),
	total_count: z.string().regex(/^\d+$/).nullable(),
});

export type FreeAgentPaginationHeaders = z.infer<
	typeof FreeAgentPaginationHeadersSchema
>;

async function waitForRetry(delayMs: number): Promise<void> {
	await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
}

/** Endpoint context: the resolved token plus the plugin's sandbox switch. */
export type FreeAgentAuth = {
	key: string;
	options?: { sandbox?: boolean };
};

function resolveAuth(auth: string | FreeAgentAuth): {
	accessToken: string;
	sandbox: boolean | undefined;
} {
	return typeof auth === 'string'
		? { accessToken: auth, sandbox: undefined }
		: { accessToken: auth.key, sandbox: auth.options?.sandbox };
}

export function freeAgentApiBase(sandbox: boolean | undefined): string {
	return sandbox ? FREEAGENT_SANDBOX_API_BASE : FREEAGENT_API_BASE;
}

/**
 * Core's ApiError keeps the request body, so a failed write would carry the
 * contact details, invoice lines or email text it sent. Rebuild it without the
 * body. FreeAgent's own error body names the failing field without echoing the
 * value ("email is not a valid email address"), so it stays: it is what tells
 * the caller how to fix the request. Status and rate-limit fields are kept.
 */
function sanitizeWriteError(error: ApiError): ApiError {
	const { body: _sentBody, ...safeRequest } = error.request;
	void _sentBody;
	return new ApiError(
		safeRequest,
		{
			url: error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: error.body,
		},
		error.message,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

export async function makeFreeAgentRequest<T>(
	endpoint: string,
	auth: string | FreeAgentAuth,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
		// `unknown` because resource envelopes vary and endpoint schemas validate returned data.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		sandbox?: boolean;
		apiVersion?: string;
	} = {},
): Promise<T> {
	const { accessToken, sandbox: authSandbox } = resolveAuth(auth);
	if (accessToken.length === 0) {
		throw new AuthMissingError('freeagent', 'oauth_2');
	}
	const { method = 'GET', body, query } = options;
	const sandbox = options.sandbox ?? authSandbox ?? false;
	const config: OpenAPIConfig = {
		BASE: freeAgentApiBase(sandbox),
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
			'User-Agent': 'Corsair FreeAgent integration',
			...(options.apiVersion ? { 'X-Api-Version': options.apiVersion } : {}),
		},
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' || method === 'PUT' ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};
	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (
			(method === 'POST' || method === 'PUT' || method === 'DELETE') &&
			error instanceof ApiError
		) {
			throw sanitizeWriteError(error);
		}
		throw error;
	}
}

export async function makeFreeAgentPaginatedRequest<T>(
	endpoint: string,
	auth: string | FreeAgentAuth,
	query: Record<string, string | number | boolean | undefined>,
	responseSchema: z.ZodType<T>,
	options: { apiVersion?: string } = {},
): Promise<{ data: T; pagination: FreeAgentPaginationHeaders }> {
	const { accessToken, sandbox } = resolveAuth(auth);
	if (accessToken.length === 0) {
		throw new AuthMissingError('freeagent', 'oauth_2');
	}
	const url = new URL(endpoint, freeAgentApiBase(sandbox));
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) url.searchParams.set(key, String(value));
	}
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: endpoint,
		query,
	};
	const headers = new Headers({
		Authorization: `Bearer ${accessToken}`,
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'User-Agent': 'Corsair FreeAgent integration',
		...(options.apiVersion ? { 'X-Api-Version': options.apiVersion } : {}),
	});
	let attempt = 0;
	while (attempt < 4) {
		attempt += 1;
		const response = await fetch(url, {
			method: 'GET',
			headers,
			credentials: 'omit',
			signal: AbortSignal.timeout(20_000),
		});
		if (response.status === 429 && attempt < 4) {
			const retryAfter = response.headers.get('Retry-After');
			const retryAfterSeconds =
				retryAfter && /^\d+$/.test(retryAfter) ? Number(retryAfter) : undefined;
			await response.body?.cancel().catch(() => undefined);
			await waitForRetry(
				retryAfterSeconds === undefined
					? Math.min(1000 * 2 ** (attempt - 1), 60_000)
					: retryAfterSeconds * 1000,
			);
			continue;
		}
		if (!response.ok) {
			const retryAfter = response.headers.get('Retry-After');
			const retryAfterSeconds =
				retryAfter && /^\d+$/.test(retryAfter) ? Number(retryAfter) : undefined;
			// `unknown`: FreeAgent's error body is JSON (`{errors: ...}`) or text.
			const errorBody: unknown = await response
				.text()
				.then((text) => {
					try {
						return JSON.parse(text);
					} catch {
						return text;
					}
				})
				.catch(() => undefined);
			throw new ApiError(
				requestOptions,
				{
					url: url.toString(),
					ok: false,
					status: response.status,
					statusText: response.statusText,
					body: errorBody,
				},
				`FreeAgent API request failed with HTTP ${response.status}`,
				retryAfterSeconds === undefined
					? undefined
					: { retryAfter: retryAfterSeconds * 1000 },
			);
		}
		// `unknown` because JSON from FreeAgent remains untrusted until the supplied output schema validates it.
		const body: unknown = await response.json();
		const totalCount = response.headers.get('X-Total-Count');
		const pagination = FreeAgentPaginationHeadersSchema.parse({
			link: response.headers.get('Link'),
			total_count: totalCount,
		});
		return { data: responseSchema.parse(body), pagination };
	}
	throw new Error('FreeAgent pagination request exhausted retries');
}
