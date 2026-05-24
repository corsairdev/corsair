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

	// 1. Create a session to get the accessJwt and did
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

	let session: SessionResponse;
	try {
		session = await request<SessionResponse>(
			sessionConfig,
			sessionRequestOptions,
		);
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

	// 2. Make the actual request using the accessJwt
	const config: OpenAPIConfig = {
		BASE: BLUESKY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${session.accessJwt}`,
		},
	};

	// Merge did into body if requested
	let finalBody = body;
	if (requiresDid && body) {
		finalBody = {
			repo: session.did,
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

	try {
		const response = await request<T>(config, requestOptions);
		return response;
	} catch (error) {
		if (error instanceof ApiError) {
			throw new BlueskyAPIError(error.message, error.status, error.retryAfter);
		}
		if (error instanceof Error) {
			throw new BlueskyAPIError(error.message);
		}
		throw new BlueskyAPIError('Unknown error');
	}
}
