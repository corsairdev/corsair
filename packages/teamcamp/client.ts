import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TEAMCAMP_API_BASE = 'https://api.teamcamp.app/v1.0';

/**
 * The key travels in an `apiKey` header. The published spec names the scheme
 * `bearerAuth` but declares it as `apiKey` in a header named `apiKey`, and the
 * live API proves the header is right: `Authorization: Bearer <key>` answers
 * 403, while `apiKey: <key>` answers 200.
 */
export const TEAMCAMP_KEY_HEADER = 'apiKey';

/**
 * Teamcamp documents no rate limit and sends no Retry-After. error-handlers.ts
 * owns retries, so the client makes one attempt and only keeps the status.
 */
const TEAMCAMP_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/** The message Teamcamp answers a bad key with, as a bare JSON string. */
export const TEAMCAMP_INVALID_KEY_MESSAGE = 'Invalid API key!!!';

/**
 * Teamcamp reports a failure two ways, and neither is a documented error
 * object:
 *
 * - A bad key answers `403` with the bare JSON string `"Invalid API key!!!"`.
 * - A bad parameter answers `400` with `{ "error": "ProjectId is required" }`.
 *
 * The 403 is also what a **valid** key gets for a project id that does not
 * exist (live-verified: `GET /task?projectId=nope` with a working key answers
 * 403 `"Invalid API key!!!"`). So a 403 on a call that already carries a key
 * is reported as what it is, an unknown or inaccessible resource, rather than
 * as an auth failure that would send a caller to re-enter a working key.
 */
export class TeamcampAPIError extends Error {
	readonly status?: number;
	/** The `error` field of a 400 body, or the bare string of a 403 body. */
	readonly detail?: string;
	/** True when the request carried a key and still got the invalid-key answer. */
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

	/**
	 * True for a real auth failure: a 401, or a 403 that came back before the
	 * key was ever accepted. A 403 on an id-bearing call is `resourceNotFound`.
	 */
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
	/**
	 * Whether this call carries a resource id that Teamcamp cannot distinguish
	 * from a bad key: it answers the same 403 for an unknown project as for an
	 * unknown key. Set for the calls whose path or query names a resource.
	 */
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

/**
 * Reads the failure text from either body shape: `{ error }` or a bare JSON
 * string. `undefined` when the body is neither.
 */
export function readTeamcampError(
	// unknown: a provider failure body is a bare string or `{ error }` until
	// this function narrows it; nothing stricter is true of it.
	body: unknown,
): string | undefined {
	// The body may arrive already parsed (corsair/http parses a JSON content
	// type) or as raw JSON text, and a bare string is valid JSON of its own, so
	// a failed parse falls back to the string rather than losing it.
	const parsed = typeof body === 'string' ? (parseJson(body) ?? body) : body;
	if (typeof parsed === 'string') {
		return parsed.length > 0 ? parsed : undefined;
	}
	const error = asRecord(parsed)?.error;
	return typeof error === 'string' && error.length > 0 ? error : undefined;
}

/** Builds the message for a failed call, using whichever body shape arrived. */
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
			// Not `TOKEN`: that renders `Authorization: Bearer`, which Teamcamp
			// rejects. The key goes in its own header.
			[TEAMCAMP_KEY_HEADER]: apiKey,
		},
	};
}

/**
 * Runs one Teamcamp request. A delete answers `200` with a bare JSON string
 * (`"The project has been deleted successfully."`), so the parsed body is
 * returned as-is and each endpoint's output schema decides what it means.
 */
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
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new TeamcampAPIError(error.message, { method });
		}
		throw new TeamcampAPIError('Unknown Teamcamp error', { method });
	}
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}
