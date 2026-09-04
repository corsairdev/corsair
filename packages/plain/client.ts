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
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

export const PLAIN_API_BASE = 'https://core-api.uk.plain.com/graphql/v1';

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
		url: '',
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

		if (response.errors && response.errors.length > 0) {
			const firstError = response.errors[0]!;
			throw new PlainAPIError(firstError.message, {
				code: firstError.extensions?.code,
			});
		}

		if (response.data === undefined) {
			throw new PlainAPIError('No data returned from Plain API');
		}

		return response.data;
	} catch (error) {
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
