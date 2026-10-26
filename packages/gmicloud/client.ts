import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { GmicloudContext } from '.';

// Serverless LLM inference (OpenAI-compatible).
export const GMI_INFERENCE_BASE = 'https://api.gmi-serving.com';
// Console APIs: IAM, GPU compute, sandboxes, the media request queue, and the router.
export const GMI_CONSOLE_BASE = 'https://console.gmicloud.ai/api';

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error.
const GMI_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/** Data-plane address of one sandbox, from sandboxes.create or sandboxes.connect. */
export type SandboxTarget = {
	sandbox_key: string;
	domain: string;
	access_token: string;
};

export class GmicloudAPIError extends Error {
	readonly status?: number;
	/** e.g. Resource.QuotaExceeded (sandboxes) or a numeric IAM substatus code. */
	readonly code?: string;
	readonly requestId?: string;
	readonly retryAfter?: number;
	// unknown: each GMI service has its own error body, and gateways can answer with text.
	readonly body?: unknown;

	constructor(
		message: string,
		cause?: Error,
		details: { status?: number; body?: unknown; retryAfter?: number } = {},
	) {
		super(message, cause ? { cause } : undefined);
		this.name = 'GmicloudAPIError';
		const source = cause instanceof ApiError ? cause : undefined;
		this.status = source?.status ?? details.status;
		this.body = source?.body ?? details.body;
		this.retryAfter = source?.retryAfter ?? details.retryAfter;
		const code = readField(this.body, 'code');
		this.code = code === undefined ? undefined : String(code);
		const requestId = readField(this.body, 'request_id');
		this.requestId = typeof requestId === 'string' ? requestId : undefined;
	}
}

// unknown: error bodies are { message } (IAM), { reason } (compute),
// { code, message, request_id } (sandboxes) or { error: { message } } (inference).
function readField(body: unknown, key: string): unknown {
	if (body && typeof body === 'object' && key in body) {
		return (body as Record<string, unknown>)[key];
	}
	return undefined;
}

// unknown: see readField.
export function describeErrorBody(body: unknown): string | undefined {
	const nested = readField(body, 'error');
	for (const value of [
		readField(body, 'message'),
		readField(body, 'reason'),
		readField(nested, 'message'),
		typeof nested === 'string' ? nested : undefined,
	]) {
		if (typeof value === 'string' && value.length > 0) return value;
	}
	return typeof body === 'string' && body.length > 0
		? body.slice(0, 500)
		: undefined;
}

export function sandboxBaseUrl(target: SandboxTarget): string {
	return `https://${target.sandbox_key}.${target.domain}`;
}

function retryAfterMs(response: Response): number | undefined {
	const seconds = Number.parseInt(
		response.headers.get('retry-after') ?? '',
		10,
	);
	return Number.isNaN(seconds) ? undefined : seconds * 1000;
}

/**
 * Downloads a sandbox file as bytes. The shared request helper decodes
 * non-JSON bodies as text, which would corrupt binary files.
 */
export async function downloadSandboxFile(
	target: SandboxTarget,
	query: { path: string; username?: string },
	range?: string,
): Promise<{ bytes: Uint8Array; contentType: string }> {
	const url = new URL(`${sandboxBaseUrl(target)}/files`);
	url.searchParams.set('path', query.path);
	if (query.username) url.searchParams.set('username', query.username);
	const response = await fetch(url, {
		headers: {
			'X-Access-Token': target.access_token,
			...(range ? { Range: range } : {}),
		},
	});
	if (!response.ok) {
		const text = await response.text();
		let body: unknown = text;
		try {
			body = JSON.parse(text);
		} catch {
			// Not JSON: keep the text body.
		}
		const detail = describeErrorBody(body);
		throw new GmicloudAPIError(
			`${response.status} ${detail ?? response.statusText}`,
			undefined,
			{ status: response.status, body, retryAfter: retryAfterMs(response) },
		);
	}
	return {
		bytes: new Uint8Array(await response.arrayBuffer()),
		contentType:
			response.headers.get('content-type') ?? 'application/octet-stream',
	};
}

type GmicloudRequest = {
	api: 'inference' | 'console' | 'sandbox';
	method: ApiRequestOptions['method'];
	url: string;
	path?: Record<string, string>;
	// unknown: query values are strings, numbers, booleans, arrays, or the metadata map.
	query?: Record<string, unknown>;
	headers?: Record<string, string | undefined>;
	body?: object;
	formData?: Record<string, Blob | string>;
	/** Required when api is 'sandbox'. */
	sandbox?: SandboxTarget;
};

function baseUrlFor(ctx: GmicloudContext, req: GmicloudRequest): string {
	if (req.api === 'sandbox') {
		if (!req.sandbox) throw new GmicloudAPIError('Missing sandbox target');
		return sandboxBaseUrl(req.sandbox);
	}
	return req.api === 'inference'
		? (ctx.options.inferenceBaseUrl ?? GMI_INFERENCE_BASE)
		: (ctx.options.consoleBaseUrl ?? GMI_CONSOLE_BASE);
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeGmicloudRequest(
	ctx: GmicloudContext,
	req: GmicloudRequest,
): Promise<unknown> {
	const dataPlane = req.api === 'sandbox';
	const config: OpenAPIConfig = {
		BASE: baseUrlFor(ctx, req).replace(/\/+$/, ''),
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// The sandbox data plane rejects Bearer auth and takes its own token.
		TOKEN: dataPlane ? undefined : ctx.key,
		HEADERS: {
			Accept: 'application/json',
			...(dataPlane
				? { 'X-Access-Token': req.sandbox?.access_token ?? '' }
				: {}),
			...(!dataPlane && ctx.options.organizationId
				? { 'X-Organization-ID': ctx.options.organizationId }
				: {}),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: req.method,
		url: req.url,
		path: req.path,
		query: req.query,
		headers: req.headers,
		body: req.body,
		formData: req.formData,
		mediaType: req.body ? 'application/json; charset=utf-8' : undefined,
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: GMI_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const detail = describeErrorBody(error.body);
			throw new GmicloudAPIError(
				detail ? `${error.status} ${detail}` : error.message,
				error,
			);
		}
		if (error instanceof Error) {
			throw new GmicloudAPIError(error.message, error);
		}
		throw new GmicloudAPIError('Unknown GMI Cloud API error');
	}
}
