import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const SNAPCHAT_ADS_API_BASE = 'https://adsapi.snapchat.com/v1';
export const SNAPCHAT_CONVERSION_API_BASE = 'https://tr.snapchat.com/v2';

export class SnapchatAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'SnapchatAPIError';
	}
}

export type SnapchatRequestOptions = {
	base?: string;
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	multipart?: boolean;
	timeoutMs?: number;
	signal?: AbortSignal;
};

export async function makeSnapchatRequest<T>(
	path: string,
	accessToken: string,
	options: SnapchatRequestOptions = {},
): Promise<T> {
	const {
		base = SNAPCHAT_ADS_API_BASE,
		method = 'GET',
		body,
		query,
		multipart = false,
		timeoutMs,
		signal,
	} = options;

	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '1.0.0',
		TIMEOUT: timeoutMs,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: accessToken,
		HEADERS: multipart
			? { Accept: 'application/json' }
			: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
	};

	const hasBody = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		body: hasBody ? body : undefined,
		mediaType: multipart ? 'multipart/form-data' : 'application/json',
		query,
	};

	const requestPromise = request<T>(config, requestOptions);

	if (!signal) {
		return requestPromise;
	}

	const onAbort = () => {
		requestPromise.cancel();
	};

	if (signal.aborted) {
		onAbort();
	}

	signal.addEventListener('abort', onAbort, { once: true });

	try {
		return await requestPromise;
	} finally {
		signal.removeEventListener('abort', onAbort);
	}
}

export function requireString(value: unknown, name: string): string {
	if (typeof value !== 'string' || !value.trim()) {
		throw new SnapchatAPIError(`[snapchat] ${name} is required`);
	}
	return value.trim();
}

export function isApiError(error: unknown): error is ApiError {
	return error instanceof ApiError;
}
