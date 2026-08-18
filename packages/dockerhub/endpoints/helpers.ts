import type { DockerHubRequestOptions } from '../client';
import { makeDockerHubRequest } from '../client';

/** Shared request helper (token from plugin keyBuilder on ctx.key). */
export async function req<T>(
	ctx: { key: string },
	endpoint: string,
	options: DockerHubRequestOptions = {},
): Promise<T> {
	return makeDockerHubRequest<T>(endpoint, ctx.key || undefined, options);
}

/**
 * Redact sensitive fields before logEventFromContext.
 * `input` is unknown because handlers receive many Zod-inferred shapes.
 */
export function summarize(
	// endpoint inputs vary per op; accept unknown and narrow for redaction
	input: unknown,
): Record<string, unknown> {
	if (!input || typeof input !== 'object') return {};
	// cast: object branch after typeof check
	const out: Record<string, unknown> = {};
	for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
		if (
			k === 'password' ||
			k === 'token' ||
			k === 'accessToken' ||
			k === 'hookUrl' ||
			k === 'url'
		) {
			out[k] = '[redacted]';
		} else {
			out[k] = v;
		}
	}
	return out;
}

export function pageQuery(input: {
	page?: number;
	pageSize?: number;
}): Record<string, number | undefined> {
	return {
		page: input.page,
		page_size: input.pageSize,
	};
}
