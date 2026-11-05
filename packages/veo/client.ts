import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { VeoContext } from './index';

export class VeoAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'VeoAPIError';
	}
}

export class VeoConfigError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'VeoConfigError';
	}
}

// Matches only corsair's "no DEK on this account" error. No dedicated error
// class exists for this state, so message matching is the only handle; kept
// narrow so it cannot swallow an unrelated failure.
const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Reads a stored credential. `get_api_key()` / `get_projectId()` throw when
 * the account has no DEK — a valid state when the caller passes credentials
 * through plugin options. Anything else thrown is operational and propagates.
 */
export async function tryGetStoredKey(
	getter: () => Promise<string | null | undefined>,
): Promise<string | undefined> {
	try {
		const value = await getter();
		return value ?? undefined;
	} catch (error) {
		if (error instanceof Error && NO_DEK_ERROR_PATTERN.test(error.message)) {
			return undefined;
		}
		throw error;
	}
}

/**
 * Transport retries are off (`maxRetries: 0`). Plugin error handlers own
 * retries, and a generation POST must not be repeated by the HTTP client:
 * predictLongRunning may already have been accepted and billed.
 * Only HTTP 429 is a rate limit.
 */
const TRANSPORT_RETRY_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
	isRateLimitError: (status) => status === 429,
};

// Regional REST host from the Veo samples, for example
// https://us-central1-aiplatform.googleapis.com/v1/projects/PROJECT/locations/us-central1/...
// The Gen AI SDK samples set location to `global`, which uses the unscoped host
// https://aiplatform.googleapis.com (same host the Interactions API documents
// for locations/global).
const RESOURCE_ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

export function veoHost(location: string): string {
	if (location === 'global') return 'https://aiplatform.googleapis.com';
	return `https://${location}-aiplatform.googleapis.com`;
}

export function assertResourceId(value: string, label: string): string {
	if (!RESOURCE_ID.test(value)) {
		throw new VeoConfigError(
			`Invalid Veo ${label}. Use letters, numbers, ".", "_" or "-".`,
		);
	}
	return value;
}

export function veoModelPath(
	projectId: string,
	location: string,
	model: string,
	method: 'predictLongRunning' | 'fetchPredictOperation',
): string {
	return `/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:${method}`;
}

const OPERATION_NAME =
	/^projects\/([^/]+)\/locations\/([^/]+)\/publishers\/google\/models\/([^/]+)\/operations\/([^/]+)$/;

export function parseOperationName(operationName: string):
	| {
			projectId: string;
			location: string;
			model: string;
			operationId: string;
	  }
	| undefined {
	const match = OPERATION_NAME.exec(operationName);
	if (!match) return undefined;
	return {
		projectId: match[1] ?? '',
		location: match[2] ?? '',
		model: match[3] ?? '',
		operationId: match[4] ?? '',
	};
}

export async function resolveProjectId(
	ctx: VeoContext,
	explicit?: string,
	fromOperation?: string,
): Promise<string> {
	if (explicit) return assertResourceId(explicit, 'projectId');
	if (fromOperation) return assertResourceId(fromOperation, 'projectId');
	if (ctx.options.projectId) {
		return assertResourceId(ctx.options.projectId, 'projectId');
	}
	const stored = await tryGetStoredKey(() => ctx.keys.get_projectId());
	if (stored) return assertResourceId(stored, 'projectId');
	throw new VeoConfigError(
		'Veo projectId is required. Pass projectId, set veo({ projectId }), or store the projectId account field.',
	);
}

export function resolveLocation(
	ctx: VeoContext,
	explicit?: string,
	fromOperation?: string,
): string {
	const location =
		explicit || fromOperation || ctx.options.location || 'us-central1';
	return assertResourceId(location, 'location');
}

export async function makeVeoRequest<T>(
	base: string,
	path: string,
	accessToken: string | undefined,
	options: {
		body: Record<string, unknown>;
	},
): Promise<T> {
	if (!accessToken) {
		throw new AuthMissingError('veo', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Image payloads can be up to the documented 20 MB input limit.
		TIMEOUT: 120_000,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: path,
		body: options.body,
		mediaType: 'application/json; charset=utf-8',
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: TRANSPORT_RETRY_CONFIG,
		});
	} catch (error) {
		// Keep ApiError intact so status and Retry-After reach error-handlers.ts.
		if (error instanceof ApiError || error instanceof Error) {
			throw error;
		}
		throw new VeoAPIError('Unknown error');
	}
}
