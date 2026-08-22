import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ConvexAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'ConvexAPIError';
	}
}

export function managementPath(segment: string): string {
	const value = String(segment);
	if (!value || /[/\\?#]/.test(value) || value.includes('..')) {
		throw new ConvexAPIError('Invalid Convex path parameter');
	}
	return encodeURIComponent(value);
}

// The Convex Management API. Deployment-scoped endpoints (execute query batch,
// query timestamp, log streams) use `https://<deployment>.convex.cloud/api`
// instead — pass `baseUrl` per request for those.
const CONVEX_MANAGEMENT_API_BASE = 'https://api.convex.dev/v1';

export interface ConvexRequestOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown> | unknown[];
	query?: Record<string, string | number | boolean | undefined>;
	/**
	 * Override the API base URL. Deployment-scoped endpoints (query batch,
	 * query timestamp, log streams) use `https://<deployment>.convex.cloud/api`.
	 */
	baseUrl?: string;
	/**
	 * Auth header scheme. Convex deploy keys authenticate as
	 * `Authorization: Convex <key>`; management API tokens use
	 * `Authorization: Bearer <token>` (default).
	 */
	authScheme?: 'bearer' | 'convex';
}

/**
 * Best-effort local cache write. The remote Convex call has already succeeded;
 * a failure here must not turn a completed operation into an endpoint error
 * (which could prompt duplicate retries of non-idempotent calls) or leave a
 * successful create/delete reported as failed.
 *
 * Note: every thrown error is intentionally swallowed — including unexpected
 * ones from the cache layer — since the provider operation has already
 * completed and must be reported as such.
 */
export async function tryCacheWrite(
	write: () => Promise<unknown>,
): Promise<void> {
	try {
		await write();
	} catch {
		// Intentionally swallowed — the provider operation already completed.
	}
}
export async function makeConvexRequest<T>(
	endpoint: string,
	apiKey: string | undefined,
	options: ConvexRequestOptions = {},
): Promise<T> {
	if (!apiKey) {
		throw new ConvexAPIError(
			'No Convex access token is configured on this connection. Management API operations require a personal/team access token; deployment-scoped operations require a deployment admin deploy key (via the deployKey input or the stored connection deploy key).',
		);
	}
	const {
		method = 'GET',
		body,
		query,
		baseUrl,
		authScheme = 'bearer',
	} = options;

	const config: OpenAPIConfig = {
		BASE: baseUrl ?? CONVEX_MANAGEMENT_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization:
				authScheme === 'convex' ? `Convex ${apiKey}` : `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			const body = error.body as
				| { message?: string; error?: string; code?: string }
				| undefined;
			throw new ConvexAPIError(
				body?.message ?? body?.error ?? error.message,
				error.status,
				body?.code ?? error.body?.code,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new ConvexAPIError(error.message);
		}
		throw new ConvexAPIError('Unknown Convex error');
	}
}
