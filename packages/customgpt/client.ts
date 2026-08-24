import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Base URL for the CustomGPT.ai REST API.
 *
 * The published OpenAPI document declares the server as `https://app.customgpt.ai`
 * with every path prefixed by `/api/v1`; that prefix is folded into the base here
 * so endpoint modules pass bare resource paths such as `projects/1/pages`.
 *
 * @see https://docs.customgpt.ai/reference/i-api-homepage
 */
export const CUSTOMGPT_API_BASE = 'https://app.customgpt.ai/api/v1';

/**
 * Error thrown for any failed CustomGPT API call.
 *
 * Carries the upstream HTTP status through so `error-handlers.ts` can decide
 * retry behaviour without re-parsing message strings.
 */
export class CustomGPTAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'CustomGPTAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

export type CustomGPTHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Query values CustomGPT accepts. Arrays are serialized as repeated keys
 * (`filters=queries&filters=conversations`), which matches the `style: form`,
 * `explode: true` declaration on every array query parameter in the spec.
 */
export type CustomGPTQueryValue =
	| string
	| number
	| boolean
	| readonly string[]
	| readonly number[]
	| undefined;

export type CustomGPTRequestOptions = {
	method?: CustomGPTHttpMethod;
	/** JSON request body. Mutually exclusive with `formData`. */
	body?: Record<string, unknown>;
	/**
	 * `multipart/form-data` request body, required by the endpoints the spec
	 * documents as multipart (agent create/update, source upload, settings
	 * update, send message, user profile update). Content-Type is deliberately
	 * left unset so fetch generates the multipart boundary.
	 */
	formData?: Record<string, unknown>;
	query?: Record<string, CustomGPTQueryValue>;
};

/**
 * Performs an authenticated request against the CustomGPT API.
 *
 * Authentication is HTTP Bearer with the account's API token, per the
 * `BearerToken` security scheme in the official OpenAPI document.
 *
 * @see https://docs.customgpt.ai/reference/api-keys-and-authentication
 */
export async function makeCustomGPTRequest<T>(
	endpoint: string,
	apiKey: string,
	options: CustomGPTRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, formData, query } = options;

	const config: OpenAPIConfig = {
		BASE: CUSTOMGPT_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
		body,
		// Setting a media type for multipart would suppress the boundary that
		// fetch derives from the FormData instance, so it is only set for JSON.
		mediaType: body === undefined ? undefined : 'application/json',
		formData,
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new CustomGPTAPIError(error.message, error.status, {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new CustomGPTAPIError(error.message, undefined, { cause: error });
		}
		throw new CustomGPTAPIError('Unknown CustomGPT API error');
	}
}
