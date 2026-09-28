import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class JigsawstackAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly rateLimitReset?: number;
	public readonly rateLimitRemaining?: number;
	public readonly rateLimitLimit?: number;

	constructor(message: string, options?: { cause?: Error }) {
		super(message, options);
		this.name = 'JigsawstackAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
			this.rateLimitReset = options.cause.rateLimitReset;
			this.rateLimitRemaining = options.cause.rateLimitRemaining;
			this.rateLimitLimit = options.cause.rateLimitLimit;
		}
	}
}

/** @see https://jigsawstack.com/docs/api-reference/authentication */
export const JIGSAWSTACK_API_BASE = 'https://api.jigsawstack.com';

export async function makeJigsawstackRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: object;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: JIGSAWSTACK_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			'x-api-key': apiKey,
		},
	};

	const cleanUrl = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

	const requestOptions: ApiRequestOptions = {
		method,
		url: cleanUrl,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new JigsawstackAPIError(error.message, { cause: error });
		}
		if (error instanceof Error) {
			throw new JigsawstackAPIError(error.message, { cause: error });
		}
		throw new JigsawstackAPIError('Unknown error');
	}
}

/** TTS (and similar) return audio bytes, not JSON. */
export async function makeJigsawstackBinaryRequest(
	endpoint: string,
	apiKey: string,
	body: object,
): Promise<{ success: true; content_type: string; base64: string }> {
	const cleanUrl = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
	const response = await fetch(`${JIGSAWSTACK_API_BASE}/${cleanUrl}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': apiKey,
		},
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		let message = response.statusText;
		try {
			const parsed: unknown = await response.json();
			if (
				parsed &&
				typeof parsed === 'object' &&
				'message' in parsed &&
				typeof parsed.message === 'string'
			) {
				message = parsed.message;
			}
		} catch {
			// keep statusText
		}
		const error = new JigsawstackAPIError(message);
		(error as { status?: number }).status = response.status;
		throw error;
	}

	const bytes = Buffer.from(await response.arrayBuffer());
	return {
		success: true,
		content_type:
			response.headers.get('content-type') ?? 'application/octet-stream',
		base64: bytes.toString('base64'),
	};
}
