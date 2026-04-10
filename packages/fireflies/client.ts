import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class FirefliesAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'FirefliesAPIError';
	}
}

const FIREFLIES_API_BASE = 'https://api.fireflies.ai';

interface GraphQLResponse<T> {
	data?: T;
	errors?: Array<{ message: string; extensions?: { code?: string } }>;
}

export async function makeFirefliesRequest<T>(
	gqlQuery: string,
	apiKey: string,
	// unknown: GraphQL variables are caller-defined; shape depends on each query/mutation
	variables?: Record<string, unknown>,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: FIREFLIES_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: '/graphql',
		body: { query: gqlQuery, variables: variables ?? {} },
		mediaType: 'application/json; charset=utf-8',
	};

	try {
		// GraphQL responses wrap all results in { data: T }
		const response = await request<GraphQLResponse<T>>(config, requestOptions);

		if (response.errors && response.errors.length > 0) {
			// non-null assertion safe: length > 0 check above
			const firstError = response.errors[0]!;
			throw new FirefliesAPIError(
				firstError.message,
				firstError.extensions?.code,
			);
		}

		if (response.data === undefined || response.data === null) {
			throw new FirefliesAPIError('No data returned from Fireflies API');
		}

		return response.data;
	} catch (error) {
		if (error instanceof FirefliesAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			// Include the response body for richer error messages (e.g. GraphQL validation errors)
			const bodyDetail =
				typeof error.body === 'string'
					? error.body
					: JSON.stringify(error.body);
			throw new FirefliesAPIError(
				`${error.statusText}: ${bodyDetail}`,
				String(error.status),
			);
		}
		if (error instanceof Error) {
			throw new FirefliesAPIError(error.message);
		}
		throw new FirefliesAPIError('Unknown error');
	}
}
