import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

/** Fly's public Machines REST API (https://docs.fly.io/machines/api/). */
export const FLY_API_BASE = 'https://api.machines.dev';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type FlyRequest = {
	method: Method;
	/** Path below the base URL; callers encode every path value. */
	path: string;
	query?: Record<string, string | number | boolean | undefined>;
	/** JSON request body; each operation's input schema validates it first. */
	body?: Record<string, unknown>;
	headers?: Record<string, string | undefined>;
	/** Milliseconds before the request is abandoned (wait and exec block). */
	timeoutMs?: number;
};

/**
 * Fly issues macaroon tokens that already carry their scheme (`FlyV1 fm2_…`)
 * and plain tokens that go after `Bearer`. Send each the way Fly expects.
 */
export function flyAuthorization(token: string): string {
	const trimmed = token.trim();
	return trimmed.startsWith('FlyV1 ') ? trimmed : `Bearer ${trimmed}`;
}

/** Encode one value for use as a single path segment. */
export const seg = (value: string) => encodeURIComponent(value);

/**
 * Send one request and return the decoded JSON body, or undefined for the
 * empty bodies Fly returns on 202/204. Core's `ApiError` passes through
 * unchanged so the error handlers can read its status and Retry-After.
 */
export async function makeFlyRequest(
	token: string,
	req: FlyRequest,
): Promise<unknown> {
	if (!token?.trim()) throw new AuthMissingError('fly', 'api_key');
	const config: OpenAPIConfig = {
		BASE: FLY_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: req.timeoutMs ?? 60_000,
		HEADERS: { Authorization: flyAuthorization(token) },
	};
	const query = Object.fromEntries(
		Object.entries(req.query ?? {}).filter(([, value]) => value !== undefined),
	);
	const headers = Object.fromEntries(
		Object.entries(req.headers ?? {}).filter(([, value]) => value),
	);
	const options: ApiRequestOptions = {
		method: req.method,
		url: req.path,
		...(Object.keys(query).length ? { query } : {}),
		...(Object.keys(headers).length ? { headers } : {}),
		...(req.body !== undefined
			? { body: req.body, mediaType: 'application/json' }
			: {}),
		errors: {
			409: 'Conflict',
			412: 'Precondition Failed',
			413: 'Payload Too Large',
			422: 'Unprocessable Entity',
		},
	};
	// The body is untyped JSON here; each operation's output schema parses it.
	const body = await request<unknown>(config, options);
	return body === '' ? undefined : body;
}
