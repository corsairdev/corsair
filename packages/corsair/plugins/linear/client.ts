import type { ApiRequestOptions } from '../../core/ApiRequestOptions';
import type { OpenAPIConfig } from '../../core/OpenAPI';
import { request } from '../../core/request';

export class LinearAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'LinearAPIError';
	}
}

const LINEAR_API_BASE = 'https://api.linear.app/graphql';

export async function makeLinearRequest<T>(
	query: string,
	token: string,
	variables?: Record<string, unknown>,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: LINEAR_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: token,
		HEADERS: {
			'Content-Type': 'application/json',
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
		const response = await request<{ data?: T; errors?: Array<{ message: string }> }>(
			config,
			requestOptions,
		);

		if (response.errors && response.errors.length > 0) {
			const errorMessage = response.errors.map((e) => e.message).join(', ');
			throw new LinearAPIError(errorMessage);
		}

		if (!response.data) {
			throw new LinearAPIError('No data returned from Linear API');
		}

		return response.data as T;
	} catch (error) {
		if (error instanceof LinearAPIError) {
			throw error;
		}
		throw new LinearAPIError(
			error instanceof Error ? error.message : 'Unknown error',
		);
	}
}

