import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class BoltIotAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'BoltIotAPIError';
	}
}

export class BoltIotRateLimitError extends BoltIotAPIError {
	constructor(message = 'Bolt IoT API rate limit exceeded') {
		super(message, 'RATE_LIMIT_ERROR', 429);
		this.name = 'BoltIotRateLimitError';
	}
}

const BOLT_IOT_API_BASE = 'https://cloud.boltiot.com/remote';

export interface BoltIotApiResponse {
	success: string | number;
	value: string;
	time?: string;
}

export async function makeBoltIotRequest<
	T extends BoltIotApiResponse = BoltIotApiResponse,
>(
	command: string,
	apiKey: string,
	query: Record<string, string | number | boolean | undefined> = {},
): Promise<T> {
	// Auth is the API key in the URL path. A Bearer TOKEN header is rejected
	// by Cloud as an expired/malformed access token.
	const config: OpenAPIConfig = {
		BASE: BOLT_IOT_API_BASE,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: `/${apiKey}/${command}`,
		query,
	};

	try {
		const res = await request<T>(config, requestOptions);
		if (String(res.success) === '0') {
			throw new BoltIotAPIError(
				res.value || `Bolt IoT command ${command} failed`,
			);
		}
		return res;
	} catch (error) {
		if (error instanceof BoltIotAPIError) {
			throw error;
		}
		if (
			error instanceof ApiError ||
			(error &&
				typeof error === 'object' &&
				'name' in error &&
				error.name === 'ApiError')
		) {
			const status = (error as { status?: number }).status;
			if (status === 429) {
				const msg =
					(error as { message?: string }).message ||
					'Bolt IoT API rate limit exceeded';
				throw new BoltIotRateLimitError(msg);
			}
		}
		if (error instanceof Error) {
			const msg = error.message.toLowerCase();
			if (
				(error as { status?: number }).status === 429 ||
				msg.includes('429') ||
				msg.includes('rate limit')
			) {
				throw new BoltIotRateLimitError(error.message);
			}
			throw new BoltIotAPIError(error.message);
		}
		throw new BoltIotAPIError('Unknown Bolt IoT API error');
	}
}
