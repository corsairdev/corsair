import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const MEMBERSTACK_API_BASE = 'https://admin.memberstack.com';

const REDACTED = '[redacted]';

function decodeSegment(segment: string): string {
	try {
		return decodeURIComponent(segment);
	} catch {
		return segment;
	}
}

// Values a failed call must not carry on: the member email (body or path),
// the password and the member JWT. Memberstack 400s can echo them.
function sensitiveValues(options: ApiRequestOptions): string[] {
	const values: string[] = [];
	const body = options.body;
	if (body && typeof body === 'object' && !Array.isArray(body)) {
		for (const field of ['email', 'password', 'token']) {
			const value = (body as Record<string, unknown>)[field];
			if (typeof value === 'string' && value) values.push(value);
		}
	}
	for (const segment of options.url.split('/')) {
		const decoded = decodeSegment(segment);
		if (decoded.includes('@')) values.push(segment, decoded);
	}
	return values.sort((a, b) => b.length - a.length);
}

// unknown: an error body is arbitrary JSON, walked without narrowing its shape.
function scrub(value: unknown, secrets: string[]): unknown {
	if (typeof value === 'string') {
		return secrets.reduce(
			(text, secret) => text.split(secret).join(REDACTED),
			value,
		);
	}
	if (Array.isArray(value)) return value.map((item) => scrub(item, secrets));
	if (value && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value).map(([key, item]) => [key, scrub(item, secrets)]),
		);
	}
	return value;
}

/**
 * Core's ApiError keeps the request it was built from, body included, and
 * only redacts query secrets. Member bodies carry emails, passwords, custom
 * fields and JWTs, and member lookups put the email in the path, so the error
 * is rebuilt without the body and with those values masked. It stays an
 * ApiError with the same status and Retry-After for the error handlers.
 */
function withoutRequestData(
	error: ApiError,
	options: ApiRequestOptions,
): ApiError {
	const secrets = sensitiveValues(options);
	const mask = (text: string) => scrub(text, secrets) as string;
	return new ApiError(
		{ method: options.method, url: mask(options.url) },
		{
			url: mask(error.url),
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: scrub(error.body, secrets),
		},
		mask(error.message),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

// The shared transport receives unchecked responses of different shapes; each
// endpoint parses the result against its own output schema before returning it.
export async function memberstackRequest(
	key: string,
	options: ApiRequestOptions,
): Promise<unknown> {
	if (!key || !key.trim()) throw new AuthMissingError('memberstack', 'api_key');
	const config: OpenAPIConfig = {
		BASE: MEMBERSTACK_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { 'X-API-KEY': key, Accept: 'application/json' },
	};
	try {
		// Core retries a 429 (honouring Retry-After) before this throws.
		// unknown: the transport cannot know the endpoint-specific response shape.
		return await request<unknown>(config, options);
	} catch (error) {
		if (error instanceof ApiError) throw withoutRequestData(error, options);
		throw error;
	}
}
