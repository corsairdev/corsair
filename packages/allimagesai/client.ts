import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { ZodType } from 'zod';

export class AllimagesaiAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'AllimagesaiAPIError';
	}
}

/** https://developer.all-images.ai/all-images.ai-api/overview */
const ALLIMAGESAI_API_BASE = 'https://api.all-images.ai/v1';

export const REDACTED_API_KEY = '[REDACTED]';

type QueryValue = string | number | boolean | undefined;

/**
 * `GET /v1/api-keys/webhook/{id}` returns an `apiKeyId` field whose value **is
 * the API key** used to make the call — confirmed by comparing the two against
 * a live account, where they are byte-identical.
 *
 * Corsair hands endpoint output to agents, event logs and the entity store, so
 * passing it through would copy a live credential into all three. The caller
 * already holds the key, so replacing it costs nothing.
 */
export function redactApiKeyId<T>(payload: T): T {
	if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
		return payload;
	}

	if (!('apiKeyId' in (payload as Record<string, unknown>))) return payload;

	return {
		...(payload as Record<string, unknown>),
		apiKeyId: REDACTED_API_KEY,
	} as T;
}

export async function makeAllimagesaiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, QueryValue>;
		schema?: ZodType<T>;
		/** Set when the provider answers 200 with an empty body. */
		expectEmptyBody?: boolean;
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		schema,
		expectEmptyBody = false,
	} = options;

	if (!apiKey) {
		throw new AllimagesaiAPIError('All Images AI API key is required');
	}

	const config: OpenAPIConfig = {
		BASE: ALLIMAGESAI_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Deliberately no TOKEN. The shared transport turns TOKEN into an
		// `Authorization: Bearer …` header; All-Images.ai authenticates on the
		// `api-key` header alone. The published spec advertises a bearer/JWT
		// security scheme, but a live probe returns 401 for Authorization,
		// X-Api-Key and every query-string variant, and 200 only for `api-key`.
		HEADERS: {
			'Content-Type': 'application/json',
			'api-key': apiKey,
		},
	};

	// Drop undefined entries so optional parameters are omitted rather than
	// serialised as the string "undefined".
	const definedQuery = query
		? Object.fromEntries(
				Object.entries(query).filter(([, value]) => value !== undefined),
			)
		: undefined;

	// DELETE carries a JSON body on this API (`{ printIds: [...] }`).
	const sendsBody = method !== 'GET';

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: sendsBody ? body : undefined,
		mediaType: 'application/json',
		query:
			definedQuery && Object.keys(definedQuery).length > 0
				? definedQuery
				: undefined,
	};

	let response: unknown;
	try {
		response = await request<T>(config, requestOptions);
	} catch (error) {
		// ApiError carries the status and body that error-handlers.ts matches on.
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new AllimagesaiAPIError(error.message);
		}
		throw new AllimagesaiAPIError('Unknown error');
	}

	if (expectEmptyBody) {
		return undefined as T;
	}

	const safe = redactApiKeyId(response);

	if (!schema) {
		return safe as T;
	}

	const parsed = schema.safeParse(safe);
	if (!parsed.success) {
		throw new AllimagesaiAPIError(
			`All Images AI returned a response that did not match the documented schema for ${endpoint}: ${parsed.error.message}`,
		);
	}

	return parsed.data;
}
