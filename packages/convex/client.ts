import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { z } from 'zod';

const ConvexErrorBodySchema = z.object({
	message: z.string().optional(),
	error: z.string().optional(),
	code: z.string().optional(),
});

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

export function assertPathSegment(value: string): void {
	if (!value || /[/\\?#]/.test(value) || value.includes('..')) {
		throw new ConvexAPIError('Invalid Convex path parameter');
	}
}

// The Convex Management API. Deployment-scoped endpoints (execute query batch,
// query timestamp, log streams) use `https://<deployment>.convex.cloud/api`
// instead — pass `baseUrl` per request for those.
const CONVEX_MANAGEMENT_API_BASE = 'https://api.convex.dev/v1';

export interface ConvexRequestOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: object;
	query?: Record<string, string | number | boolean | undefined>;
	/** Values for `{name}` placeholders in the endpoint; URI-component encoded. */
	path?: Record<string, string>;
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
export async function tryCacheWrite<T>(write: () => Promise<T>): Promise<void> {
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
		path,
		baseUrl,
		authScheme = 'bearer',
	} = options;
	for (const value of Object.values(path ?? {})) {
		assertPathSegment(value);
	}

	const config: OpenAPIConfig = {
		BASE: baseUrl ?? CONVEX_MANAGEMENT_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		ENCODE_PATH: encodeURIComponent,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization:
				authScheme === 'convex' ? `Convex ${apiKey}` : `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		path,
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
			const parsed = ConvexErrorBodySchema.safeParse(error.body);
			const body = parsed.success ? parsed.data : undefined;
			throw new ConvexAPIError(
				body?.message ?? body?.error ?? error.message,
				error.status,
				body?.code,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new ConvexAPIError(error.message);
		}
		throw new ConvexAPIError('Unknown Convex error');
	}
}
