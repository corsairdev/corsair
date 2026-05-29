import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class BlueskyAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'BlueskyAPIError';
	}
}

const BLUESKY_API_BASE = 'https://bsky.social';

interface SessionResponse {
	accessJwt: string;
	refreshJwt: string;
	handle: string;
	did: string;
}

interface CachedSession {
	accessJwt: string;
	did: string;
	createdAt: number;
}

const sessionCache = new Map<string, CachedSession>();

async function getOrUpdateSession(
	apiKey: string,
	handle: string,
): Promise<CachedSession> {
	const cacheKey = `${handle}:${apiKey}`;
	const now = Date.now();
	const cached = sessionCache.get(cacheKey);

	// Reuse the cached session if it's less than 50 minutes old
	if (cached && now - cached.createdAt < 50 * 60 * 1000) {
		return cached;
	}

	const sessionConfig: OpenAPIConfig = {
		BASE: BLUESKY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const sessionRequestOptions: ApiRequestOptions = {
		method: 'POST',
		url: '/xrpc/com.atproto.server.createSession',
		body: {
			identifier: handle,
			password: apiKey,
		},
		mediaType: 'application/json; charset=utf-8',
	};

	try {
		const session = await request<SessionResponse>(
			sessionConfig,
			sessionRequestOptions,
		);
		const newSession: CachedSession = {
			accessJwt: session.accessJwt,
			did: session.did,
			createdAt: now,
		};
		sessionCache.set(cacheKey, newSession);
		return newSession;
	} catch (error) {
		if (error instanceof ApiError) {
			throw new BlueskyAPIError(
				`Failed to create Bluesky session: ${error.message}`,
				error.status,
				error.retryAfter,
				'SESSION_CREATION_FAILED',
			);
		}
		if (error instanceof Error) {
			throw new BlueskyAPIError(
				`Failed to create Bluesky session: ${error.message}`,
			);
		}
		throw new BlueskyAPIError('Unknown error during session creation');
	}
}

export function clearSessionCache(apiKey: string, handle: string): void {
	const cacheKey = `${handle}:${apiKey}`;
	sessionCache.delete(cacheKey);
}

export async function makeBlueskyRequest<T>(
	endpoint: string,
	apiKey: string, // This will store the app password
	handle: string, // This will store the handle
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		requiresDid?: boolean;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, requiresDid = false } = options;

	if (!handle) {
		throw new BlueskyAPIError(
			'Handle is required for Bluesky integration',
			undefined,
			undefined,
			'MISSING_HANDLE',
		);
	}
	if (!apiKey) {
		throw new BlueskyAPIError(
			'App password (API Key) is required for Bluesky integration',
			undefined,
			undefined,
			'MISSING_PASSWORD',
		);
	}

	const session = await getOrUpdateSession(apiKey, handle);

	const executeRequest = async (currentSession: CachedSession): Promise<T> => {
		const config: OpenAPIConfig = {
			BASE: BLUESKY_API_BASE,
			VERSION: '1.0.0',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
			TOKEN: undefined,
			HEADERS: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${currentSession.accessJwt}`,
			},
		};

		let finalBody = body;
		if (requiresDid && body) {
			finalBody = {
				repo: currentSession.did,
				...body,
			};
		}

		const requestOptions: ApiRequestOptions = {
			method,
			url: `/xrpc/${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`,
			body:
				method === 'POST' || method === 'PUT' || method === 'PATCH'
					? finalBody
					: undefined,
			mediaType: 'application/json; charset=utf-8',
			query: method === 'GET' ? query : undefined,
		};

		return await request<T>(config, requestOptions);
	};

	try {
		return await executeRequest(session);
	} catch (error) {
		// If unauthorized (401), clear session cache and try one more time
		if (error instanceof ApiError && error.status === 401) {
			clearSessionCache(apiKey, handle);
			const freshSession = await getOrUpdateSession(apiKey, handle);
			try {
				return await executeRequest(freshSession);
			} catch (retryError) {
				if (retryError instanceof ApiError) {
					throw new BlueskyAPIError(
						retryError.message,
						retryError.status,
						retryError.retryAfter,
					);
				}
				if (retryError instanceof Error) {
					throw new BlueskyAPIError(retryError.message);
				}
				throw new BlueskyAPIError('Unknown error during retry');
			}
		}

		if (error instanceof ApiError) {
			throw new BlueskyAPIError(error.message, error.status, error.retryAfter);
		}
		if (error instanceof Error) {
			throw new BlueskyAPIError(error.message);
		}
		throw new BlueskyAPIError('Unknown error');
	}
}
