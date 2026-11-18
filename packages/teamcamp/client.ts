import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TEAMCAMP_API_BASE = 'https://api.teamcamp.app/v1.0';

export const TEAMCAMP_KEY_HEADER = 'apiKey';

const TEAMCAMP_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

export const TEAMCAMP_INVALID_KEY_MESSAGE = 'Invalid API key!!!';

export class TeamcampAPIError extends Error {
	readonly status?: number;
	readonly detail?: string;
	readonly resourceNotFound: boolean;
	readonly retryAfter?: number;
	readonly method?: string;

	constructor(
		message: string,
		options: {
			status?: number;
			detail?: string;
			resourceNotFound?: boolean;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message);
		this.name = 'TeamcampAPIError';
		this.status = options.status;
		this.detail = options.detail;
		this.resourceNotFound = options.resourceNotFound ?? false;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
	}

	get isAuthError(): boolean {
		return (
			this.status === 401 || (this.status === 403 && !this.resourceNotFound)
		);
	}
}

export type TeamcampRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: Record<string, string | number | boolean | undefined>;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	resourceScoped?: boolean;
};

// unknown: the text is a provider body whose shape each endpoint's output
// schema validates, so a concrete return type would be a claim this function
// cannot make for every caller.
function parseJson(text: string): unknown {
	try {
		return JSON.parse(text);
	} catch {
		return undefined;
	}
}

export function readTeamcampError(
	// unknown: a provider failure body is a bare string or `{ error }` until
	body: unknown,
): string | undefined {
	const parsed = typeof body === 'string' ? (parseJson(body) ?? body) : body;
	if (typeof parsed === 'string') {
		return parsed.length > 0 ? parsed : undefined;
	}
	const error = asRecord(parsed)?.error;
	return typeof error === 'string' && error.length > 0 ? error : undefined;
}

export function describeTeamcampError(
	status: number | undefined,
	statusText: string | undefined,
	// unknown: same open failure body as readTeamcampError.
	body: unknown,
	resourceScoped: boolean,
): string {
	const detail = readTeamcampError(body);
	if (status === 403 && resourceScoped) {
		return 'Teamcamp 403: the project or task does not exist, or this key cannot see it. Teamcamp answers an unknown resource with its invalid-key message, so the key itself may still be valid.';
	}
	if (detail)
		return `Teamcamp ${status ?? ''}: ${detail}`.replace(
			'Teamcamp :',
			'Teamcamp:',
		);
	return status === undefined
		? 'Teamcamp request failed'
		: `Teamcamp request failed (${statusText || status})`;
}

function configFor(apiKey: string): OpenAPIConfig {
	return {
		BASE: TEAMCAMP_API_BASE,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			[TEAMCAMP_KEY_HEADER]: apiKey,
		},
	};
}

export async function makeTeamcampRequest<T>(
	apiKey: string,
	{ method, path, query, body, resourceScoped = false }: TeamcampRequest,
): Promise<T> {
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: each endpoint's output schema validates the body, which
		// differs per call and is a bare array on most of them.
		const raw = await request<unknown>(configFor(apiKey), requestOptions, {
			rateLimitConfig: TEAMCAMP_RATE_LIMIT_CONFIG,
		});
		return raw as T;
	} catch (error) {
		if (error instanceof TeamcampAPIError) throw error;
		if (error instanceof ApiError) {
			throw new TeamcampAPIError(
				describeTeamcampError(
					error.status,
					error.statusText,
					error.body,
					resourceScoped,
				),
				{
					status: error.status,
					detail: readTeamcampError(error.body),
					resourceNotFound: error.status === 403 && resourceScoped,
					retryAfter: error.retryAfter,
					method,
				},
			);
		}
		if (error instanceof Error || error instanceof DOMException) {
			throw new TeamcampAPIError(error.message, { method });
		}
		throw new TeamcampAPIError('Unknown Teamcamp error', { method });
	}
}

export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}
