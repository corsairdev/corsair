import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export const DRAFTABLE_API_BASE = 'https://api.draftable.com';

export type DraftableRequest = {
	method?: 'GET' | 'POST' | 'DELETE';
	/** Path after `/v1`, with every path value already encoded. */
	path: string;
	query?: Record<string, string | number | undefined>;
	// unknown: each operation's zod input schema has already checked the body.
	body?: Record<string, unknown>;
};

/** Encode one path value so ids cannot add path segments. */
export function pathPart(value: string): string {
	return encodeURIComponent(value);
}

/**
 * Draftable takes the auth token as `Authorization: Token <token>`. Core's
 * `request()` keeps its default 429 retries (it honours Retry-After).
 */
export async function makeDraftableRequest<T>(
	apiKey: string,
	req: DraftableRequest,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: DRAFTABLE_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Token ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: req.method ?? 'GET',
		url: `/v1${req.path}`,
		query: req.query,
		...(req.body !== undefined
			? { body: req.body, mediaType: 'application/json' }
			: {}),
	};

	return await request<T>(config, requestOptions);
}

/**
 * Signs a viewer link the way Draftable's client libraries do: hex
 * HMAC-SHA256 of the JSON policy `{ account_id, identifier, valid_until }`,
 * keyed with the auth token. Uses Web Crypto so it runs on Node and edge.
 */
export async function signViewerPolicy(
	authToken: string,
	policy: { account_id: string; identifier: string; valid_until: number },
): Promise<string> {
	const encoder = new TextEncoder();
	const key = await globalThis.crypto.subtle.importKey(
		'raw',
		encoder.encode(authToken),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign'],
	);
	const signature = await globalThis.crypto.subtle.sign(
		'HMAC',
		key,
		encoder.encode(
			JSON.stringify({
				account_id: policy.account_id,
				identifier: policy.identifier,
				valid_until: policy.valid_until,
			}),
		),
	);
	return Array.from(new Uint8Array(signature))
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('');
}
