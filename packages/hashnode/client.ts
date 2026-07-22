import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class HashnodeAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string | number,
		public readonly status?: number,
		public readonly retryAfter?: number,
		public readonly body?: unknown,
		options?: ErrorOptions,
	) {
		super(message, options);
		this.name = 'HashnodeAPIError';
	}
}

const HASHNODE_API_BASE = 'https://gql-beta.hashnode.com';

export async function makeHashnodeRequest<T>(
	query: string,
	token: string,
	variables?: Record<string, unknown>,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: HASHNODE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: '',
		body: {
			query,
			variables: variables || {},
		},
		mediaType: 'application/json',
	};

	try {
		const response = await request<{
			data?: T;
			errors?: Array<{ message: string; extensions?: Record<string, unknown> }>;
		}>(config, requestOptions);

		if (response.errors && response.errors.length > 0) {
			const errorMessage = response.errors.map((e) => e.message).join(', ');
			const firstError = response.errors[0];
			const errorCode = firstError?.extensions?.code;
			throw new HashnodeAPIError(
				errorMessage,
				typeof errorCode === 'string' || typeof errorCode === 'number'
					? errorCode
					: undefined,
			);
		}

		if (!response.data) {
			throw new HashnodeAPIError('No data returned from Hashnode API');
		}

		return response.data as T;
	} catch (error) {
		if (error instanceof HashnodeAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			const bodyDetail =
				typeof error.body === 'object'
					? JSON.stringify(error.body)
					: String(error.body ?? '');
			throw new HashnodeAPIError(
				`${error.message} (status=${error.status}, body=${bodyDetail})`,
				undefined,
				error.status,
				error.retryAfter,
				error.body,
				{ cause: error },
			);
		}
		throw new HashnodeAPIError(
			error instanceof Error ? error.message : 'Unknown error',
		);
	}
}
