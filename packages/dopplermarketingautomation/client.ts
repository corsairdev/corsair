import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions } from 'corsair/http';
import { ApiError } from 'corsair/http';

const BASE_URL = 'https://restapi.fromdoppler.com';

export type DopplerRequestOptions = {
	method: ApiRequestOptions['method'];
	query?: Record<string, string | number | boolean | undefined>;
	headers?: Record<string, string | undefined>;
	// Bodies have different endpoint-validated JSON shapes or raw text; no single
	// stricter type covers all provider payloads without duplicating those schemas.
	body?: unknown;
	mediaType?: string;
	responseType?: 'json' | 'text' | 'bytes' | 'void';
};

/** Performs exactly one request. In particular, writes are never replayed. */
export async function makeDopplerMarketingAutomationRequest<T>(
	path: string,
	apiKey: string,
	options: DopplerRequestOptions,
): Promise<T> {
	if (!apiKey?.trim())
		throw new AuthMissingError('dopplermarketingautomation', 'api_key');
	const url = new URL(path, BASE_URL);
	for (const [name, value] of Object.entries(options.query ?? {})) {
		if (value !== undefined) url.searchParams.append(name, String(value));
	}
	const headers = new Headers({ Authorization: `token ${apiKey}` });
	for (const [name, value] of Object.entries(options.headers ?? {})) {
		if (value !== undefined) headers.set(name, value);
	}
	let body: string | undefined;
	if (options.body !== undefined) {
		const mediaType = options.mediaType ?? 'application/json';
		headers.set('Content-Type', mediaType);
		body =
			mediaType === 'application/json'
				? JSON.stringify(options.body)
				: (options.body as string);
	}
	const response = await fetch(url, { method: options.method, headers, body });
	if (!response.ok) {
		const text = await response.text();
		// Provider errors can be arbitrary JSON or plain text, so their shape is
		// not known until inspected by the caller.
		let payload: unknown = text;
		try {
			payload = JSON.parse(text);
		} catch {
			/* Non-JSON provider error. */
		}
		const retryAfter = response.headers.get('retry-after');
		const seconds = retryAfter === null ? NaN : Number(retryAfter);
		const retryDate = retryAfter === null ? NaN : Date.parse(retryAfter);
		const delay = Number.isFinite(seconds)
			? Math.max(0, seconds * 1000)
			: Number.isFinite(retryDate)
				? Math.max(0, retryDate - Date.now())
				: undefined;
		throw new ApiError(
			{ method: options.method, url: path },
			{
				url: url.toString(),
				ok: false,
				status: response.status,
				statusText: response.statusText,
				body: payload,
			},
			response.statusText || 'Doppler API error',
			delay === undefined ? undefined : { retryAfter: delay },
		);
	}
	if (
		options.responseType === 'void' ||
		response.status === 204 ||
		options.method === 'HEAD'
	)
		return undefined as T;
	if (options.responseType === 'bytes')
		return new Uint8Array(await response.arrayBuffer()) as T;
	if (options.responseType === 'text') return (await response.text()) as T;
	return (await response.json()) as T;
}
