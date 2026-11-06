import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class FalAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'FalAPIError';
	}
}

/**
 * fal answers on four hosts: the queue (async model calls), the run host
 * (sync model calls), the Platform API (models, pricing, usage, requests,
 * billing) and the REST host (file storage).
 */
export const FAL_HOSTS = {
	queue: 'https://queue.fal.run',
	run: 'https://fal.run',
	api: 'https://api.fal.ai/v1',
	rest: 'https://rest.fal.ai',
} as const;

export type FalHost = keyof typeof FAL_HOSTS;

// Retries are the error handlers' call (error-handlers.ts), so the transport
// makes one attempt: a retried model call can bill twice.
const FAL_NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type FalRequestInit = {
	method?: RequestMethod;
	query?: Record<
		string,
		string | number | boolean | readonly string[] | undefined
	>;
	body?: unknown;
	headers?: Record<string, string | undefined>;
};

export async function makeFalRequest<T>(
	host: FalHost,
	path: string,
	apiKey: string,
	init: FalRequestInit = {},
): Promise<T> {
	const { method = 'GET', query, body, headers } = init;
	const hasBody = method === 'POST' || method === 'PUT';

	const config: OpenAPIConfig = {
		BASE: FAL_HOSTS[host],
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Authorization: `Key ${apiKey}`,
		},
	};

	const options: ApiRequestOptions = {
		method,
		url: path,
		query,
		headers: headers
			? (Object.fromEntries(
					Object.entries(headers).filter(([, value]) => value !== undefined),
				) as Record<string, string>)
			: undefined,
		body: hasBody ? (body ?? {}) : undefined,
		mediaType: hasBody ? 'application/json; charset=utf-8' : undefined,
	};

	try {
		return await request<T>(config, options, {
			rateLimitConfig: FAL_NO_TRANSPORT_RETRIES,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new FalAPIError(error.message);
		}
		throw new FalAPIError('Unknown fal API error');
	}
}

/**
 * PUT bytes to a signed storage URL that `storage/upload/initiate` returned.
 * The URL carries its own signature, so the fal key is never sent with it.
 */
export async function putToSignedUrl(
	uploadUrl: string,
	bytes: Uint8Array,
	contentType: string,
): Promise<void> {
	const response = await fetch(uploadUrl, {
		method: 'PUT',
		body: bytes,
		headers: { 'Content-Type': contentType },
	});
	if (!response.ok) {
		throw new FalAPIError(
			`fal storage upload failed with HTTP ${response.status}`,
			response.status,
		);
	}
}

// ── Endpoint ids and request references ─────────────────────────────────────

const SEGMENT_RE = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

/**
 * Splits a model endpoint id such as `fal-ai/flux/schnell` into its parts.
 * The queue reads a request back on `{owner}/{app}` only: adding the endpoint
 * path (`fal-ai/flux/schnell/requests/...`) answers 405.
 */
export function parseEndpointId(endpointId: string): {
	owner: string;
	app: string;
	path: string[];
} {
	const segments = endpointId
		.trim()
		.replace(/^\/+|\/+$/g, '')
		.split('/');
	const [owner, app, ...path] = segments;
	if (
		!owner ||
		!app ||
		segments.some((segment) => !SEGMENT_RE.test(segment) || segment === '..')
	) {
		throw new FalAPIError(
			`"${endpointId}" is not a fal endpoint id. Expected owner/app or owner/app/path, for example fal-ai/flux/schnell.`,
		);
	}
	return { owner, app, path };
}

export function endpointPath(endpointId: string): string {
	const { owner, app, path } = parseEndpointId(endpointId);
	return `/${[owner, app, ...path].map(encodeURIComponent).join('/')}`;
}

const QUEUE_URL_HOSTS = new Set(['queue.fal.run', 'queue.falrun.com']);
const REQUEST_ID_RE = /^[A-Za-z0-9][A-Za-z0-9-]*$/;

/**
 * Where a queue request lives: `/{owner}/{app}/requests/{id}`. Built from
 * `endpointId` + `requestId`, or read from the `response_url` the submit
 * returned (only a fal queue URL is accepted, so the key never leaves fal).
 */
export function requestBasePath(ref: {
	endpointId?: string;
	requestId?: string;
	responseUrl?: string;
}): { basePath: string; requestId: string } {
	if (ref.endpointId && ref.requestId) {
		const { owner, app } = parseEndpointId(ref.endpointId);
		if (!REQUEST_ID_RE.test(ref.requestId)) {
			throw new FalAPIError(
				`"${ref.requestId}" is not a fal request id (the request_id a submit returned).`,
			);
		}
		return {
			basePath: `/${encodeURIComponent(owner)}/${encodeURIComponent(app)}/requests/${encodeURIComponent(ref.requestId)}`,
			requestId: ref.requestId,
		};
	}

	if (ref.responseUrl) {
		let url: URL;
		try {
			url = new URL(ref.responseUrl);
		} catch {
			throw new FalAPIError(`"${ref.responseUrl}" is not a URL.`);
		}
		const match = url.pathname.match(
			/^\/([^/]+)\/([^/]+)\/requests\/([^/]+?)(?:\/(?:status|cancel))?\/?$/,
		);
		if (
			url.protocol !== 'https:' ||
			!QUEUE_URL_HOSTS.has(url.hostname) ||
			!match
		) {
			throw new FalAPIError(
				'responseUrl must be the response_url a fal queue submit returned, for example https://queue.fal.run/fal-ai/flux/requests/<request id>.',
			);
		}
		const [, rawOwner, rawApp, rawRequestId] = match as unknown as [
			string,
			string,
			string,
			string,
		];
		return requestBasePath({
			endpointId: `${decodeURIComponent(rawOwner)}/${decodeURIComponent(rawApp)}`,
			requestId: decodeURIComponent(rawRequestId),
		});
	}

	throw new FalAPIError(
		'Pass endpointId and requestId, or the responseUrl the submit returned.',
	);
}

/** A readable message from a fal error body (`detail` string or validation list). */
export function falErrorMessage(error: unknown): string {
	if (error instanceof ApiError) {
		const body = error.body as Record<string, unknown> | string | undefined;
		if (typeof body === 'string' && body.trim()) {
			return `${error.status}: ${body.trim()}`;
		}
		if (body && typeof body === 'object') {
			const detail = body.detail;
			if (typeof detail === 'string') return `${error.status}: ${detail}`;
			if (Array.isArray(detail)) {
				const parts = detail.map((item) => {
					const entry = item as { loc?: unknown[]; msg?: string };
					const loc = Array.isArray(entry.loc) ? entry.loc.join('.') : '';
					return loc ? `${loc}: ${entry.msg ?? 'invalid'}` : (entry.msg ?? '');
				});
				return `${error.status}: ${parts.filter(Boolean).join('; ')}`;
			}
			const nested = body.error as { message?: string } | string | undefined;
			if (typeof nested === 'string') return `${error.status}: ${nested}`;
			if (nested?.message) return `${error.status}: ${nested.message}`;
		}
		return `${error.status}: ${error.message}`;
	}
	return error instanceof Error ? error.message : String(error);
}
