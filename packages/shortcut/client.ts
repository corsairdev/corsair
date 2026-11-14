import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const SHORTCUT_API_BASE = 'https://api.app.shortcut.com';

export class ShortcutNetworkError extends Error {
	constructor() {
		super('Shortcut network request failed');
		this.name = 'ShortcutNetworkError';
	}
}

export type ShortcutRequestOptions = {
	method?: ApiRequestOptions['method'];
	path?: Record<string, string | number>;
	// Endpoint-specific query values vary; each is narrowed by its Zod input schema.
	query?: Record<string, unknown>;
	body?: object;
	formData?: object;
};

export async function makeShortcutRequest(
	endpoint: string,
	apiKey: string | undefined,
	options: ShortcutRequestOptions = {},
): Promise<unknown> {
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('shortcut', 'api_key');
	}
	if (!apiKey) throw new AuthMissingError('shortcut', 'api_key');

	const config: OpenAPIConfig = {
		BASE: SHORTCUT_API_BASE,
		VERSION: '3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Shortcut-Token': apiKey,
			...(options.formData ? {} : { 'Content-Type': 'application/json' }),
		},
	};
	const requestOptions: ApiRequestOptions = {
		method: options.method ?? 'GET',
		url: endpoint,
		path: options.path,
		query: options.query,
		body: options.body,
		formData: options.formData,
		mediaType: options.formData ? undefined : 'application/json; charset=utf-8',
	};

	try {
		// Provider JSON is unknown here; the endpoint-specific output schema validates it.
		return await request<unknown>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			// Provider error bodies and request payloads can contain private story/document text.
			const safeRequest: ApiRequestOptions = {
				...error.request,
				body: undefined,
				formData: undefined,
			};
			throw new ApiError(
				safeRequest,
				{
					url: error.url,
					ok: false,
					status: error.status,
					statusText: error.statusText,
					body: undefined,
				},
				`Shortcut request failed with HTTP ${error.status}`,
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
				},
			);
		}
		if (error instanceof Error) throw new ShortcutNetworkError();
		// `unknown` because JavaScript permits throwing values that are not Error instances.
		throw new ShortcutNetworkError();
	}
}
