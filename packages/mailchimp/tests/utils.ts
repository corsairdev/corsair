import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import type { ApiRequestOptions, ApiResult, OpenAPIConfig } from 'corsair/http';
import { ApiError } from 'corsair/http';

export const TEST_API_KEY = process.env.MAILCHIMP_API_KEY;
export const TEST_ACCESS_TOKEN = process.env.MAILCHIMP_ACCESS_TOKEN;

/** `describe` that is skipped unless live Mailchimp credentials are present. */
export const mailchimpDescribe =
	TEST_API_KEY || TEST_ACCESS_TOKEN ? describe : describe.skip;

/**
 * Builds an {@link ApiError} with a Mailchimp-style RFC-7807 problem body so
 * error-handler matching and detail extraction can be tested without network.
 */
export function mockApiError(
	status: number,
	detail: string,
	options: {
		retryAfter?: number;
		title?: string;
		errors?: Array<{ field: string; message: string }>;
	} = {},
): ApiError {
	const request: ApiRequestOptions = {
		method: 'GET',
		url: 'https://us19.api.mailchimp.com/3.0/lists',
	};
	const response: ApiResult = {
		url: 'https://us19.api.mailchimp.com/3.0/lists',
		ok: false,
		status,
		statusText: status === 429 ? 'Too Many Requests' : 'Error',
		body: {
			type: 'https://mailchimp.com/developer/marketing/docs/errors/',
			title: options.title ?? 'Error',
			status,
			detail,
			instance: 'req_test',
			...(options.errors ? { errors: options.errors } : {}),
		},
	};
	return new ApiError(request, response, detail, {
		retryAfter: options.retryAfter,
	});
}

/** URL-encodes a nested object into Mailchimp's bracketed form-encoded body. */
export function toFormEncoded(
	obj: Record<string, unknown>,
	prefix = '',
): string {
	const pairs: string[] = [];
	for (const [key, value] of Object.entries(obj)) {
		const path = prefix ? `${prefix}[${key}]` : key;
		if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
			pairs.push(toFormEncoded(value as Record<string, unknown>, path));
		} else {
			pairs.push(
				`${encodeURIComponent(path)}=${encodeURIComponent(String(value))}`,
			);
		}
	}
	return pairs.filter(Boolean).join('&');
}

/** Builds a raw (unparsed, form-encoded) webhook request for matcher tests. */
export function mockRawWebhookRequest(
	body: Record<string, unknown>,
	headers: Record<string, string | string[] | undefined> = {
		'content-type': 'application/x-www-form-urlencoded',
	},
): RawWebhookRequest {
	return { headers, body: toFormEncoded(body) };
}

/** Builds a parsed webhook request with an optional secret query parameter. */
export function mockWebhookRequest<T>(
	payload: T,
	options: { secret?: string; query?: Record<string, string> } = {},
): WebhookRequest<T> {
	const query = { ...(options.query ?? {}) };
	if (options.secret !== undefined) query.secret = options.secret;
	return {
		payload,
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		query,
	};
}

export type { OpenAPIConfig };
