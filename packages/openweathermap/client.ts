import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class OpenWeatherMapAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: number,
	) {
		super(message);
		this.name = 'OpenWeatherMapAPIError';
	}
}

const OPENWEATHERMAP_API_BASE = 'https://api.openweathermap.org/data/3.0';

/**
 * Performs a request to the OpenWeatherMap One Call API 3.0.
 *
 * Auth: API key passed as the `appid` query parameter (the only supported method).
 * All endpoints are GET-only.
 */
export async function makeOpenWeatherMapRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { query = {} } = options;

	const config: OpenAPIConfig = {
		BASE: OPENWEATHERMAP_API_BASE,
		VERSION: '3.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	// OpenWeatherMap authenticates via the `appid` query parameter
	const queryWithAuth: Record<string, string | number | boolean | undefined> = {
		...query,
		appid: apiKey,
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: endpoint,
		query: queryWithAuth,
	};

	try {
		const response = await request<T>(config, requestOptions);
		return response;
	} catch (error) {
		if (error instanceof Error) {
			throw new OpenWeatherMapAPIError(error.message);
		}
		throw new OpenWeatherMapAPIError('Unknown error');
	}
}
