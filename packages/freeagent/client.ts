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

export async function makeFreeAgentRequest<T>(
	endpoint: string,
	accessToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
		// `unknown` because resource envelopes vary and endpoint schemas validate returned data.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		sandbox?: boolean;
	} = {},
): Promise<T> {
	if (accessToken.length === 0) {
		throw new AuthMissingError('freeagent', 'oauth_2');
	}
	const { method = 'GET', body, query, sandbox = false } = options;
	const config: OpenAPIConfig = {
		BASE: sandbox ? FREEAGENT_SANDBOX_API_BASE : FREEAGENT_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
			'User-Agent': 'Corsair FreeAgent integration',
		},
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' || method === 'PUT' ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};
	return request<T>(config, requestOptions);
}

export async function makeFreeAgentPaginatedRequest<T>(
	endpoint: string,
	accessToken: string,
	query: Record<string, string | number | boolean | undefined>,
	responseSchema: z.ZodType<T>,
): Promise<{ data: T; pagination: FreeAgentPaginationHeaders }> {
	if (accessToken.length === 0) {
		throw new AuthMissingError('freeagent', 'oauth_2');
	}
	const url = new URL(endpoint, FREEAGENT_API_BASE);
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
			await response.body?.cancel().catch(() => undefined);
			throw new ApiError(
				requestOptions,
				{
					url: url.toString(),
					ok: false,
					status: response.status,
					statusText: response.statusText,
					body: undefined,
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
