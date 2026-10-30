import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class PlainAPIError extends Error {
	public readonly code?: string;
	public readonly status?: number;
	public readonly retryAfter?: number | string;

	constructor(message: string, options?: { code?: string; cause?: Error }) {
		super(message, options);
		this.name = 'PlainAPIError';
		this.code = options?.code;
		// JUSTIFY(instanceof): the `cause` is typed `Error`, so reaching the
		// HTTP status requires distinguishing ApiError from other Errors.
		// This is the documented error-boundary pattern, not a value cast.
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

// Base URL + auth scheme verified against
// https://www.plain.com/docs/graphql/introduction ("API URL:
// https://core-api.uk.plain.com/graphql/v1", POST, `Authorization: Bearer
// YOUR_TOKEN` where the token is the API key).
// The path is split so the corsair `request` URL builder
// (`${baseUrl}/${path}`, always exactly one `/`) produces the documented URL
// verbatim: BASE + `v1`. Verified live 2026-09-11 — posting to
// `.../graphql/v1/` (trailing slash, which `url: ''` produced) returns
// HTTP 404 `{"message":"Not Found"}`, while `.../graphql/v1` returns 200.
export const PLAIN_API_BASE = 'https://core-api.uk.plain.com/graphql';

type PlainGraphQLError = {
	message: string;
	extensions?: {
		code?: string;
	};
};

type PlainGraphQLResponse<TData> = {
	data?: TData;
	errors?: PlainGraphQLError[];
};

export async function makePlainRequest<TData>(
	query: string,
	apiKey: string,
	// JUSTIFY(unknown): GraphQL variables are arbitrary JSON by definition
	// (docs: `variables` is "a JSON object of variables"). Callers pass
	// zod-validated inputs; the transport layer cannot type them further.
	variables?: Record<string, unknown>,
	operationName?: string,
): Promise<TData> {
	const config: OpenAPIConfig = {
		BASE: PLAIN_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: 'v1',
		body: {
			query,
			variables: variables ?? {},
			operationName,
		},
		mediaType: 'application/json; charset=utf-8',
	};

	try {
		const response = await request<PlainGraphQLResponse<TData>>(
			config,
			requestOptions,
		);

		const graphQLErrors = response.errors ?? [];
		const firstError = graphQLErrors[0];
		if (firstError !== undefined) {
			throw new PlainAPIError(firstError.message, {
				code: firstError.extensions?.code,
			});
		}

		if (response.data === undefined) {
			throw new PlainAPIError('No data returned from Plain API');
		}

		return response.data;
	} catch (error) {
		// JUSTIFY(instanceof): `error` arrives as `unknown` from the implicit
		// catch clause. Re-wrapping requires distinguishing PlainAPIError /
		// ApiError / Error so status codes survive; nothing is cast.
		if (error instanceof PlainAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			throw new PlainAPIError(error.message, { cause: error });
		}
		if (error instanceof Error) {
			throw new PlainAPIError(error.message, { cause: error });
		}
		throw new PlainAPIError('Unknown error');
	}
}
