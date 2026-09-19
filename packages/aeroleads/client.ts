import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class AeroleadsAPIError extends Error {
	readonly status?: number;
	readonly body?: unknown;

	constructor(
		message: string,
		options: { status?: number; body?: unknown } = {},
	) {
		super(message);
		this.name = 'AeroleadsAPIError';
		this.status = options.status;
		this.body = options.body;
	}
}

const AEROLEADS_API_BASE = 'https://aeroleads.com';

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasProfileData(body: Record<string, unknown>): boolean {
	return Object.entries(body).some(([key, value]) => {
		if (key === 'message' || key === 'status') return false;
		if (value == null) return false;
		if (typeof value === 'string') return value.trim().length > 0;
		if (Array.isArray(value)) return value.length > 0;
		return true;
	});
}

export function assertAeroleadsSuccess(body: unknown): void {
	if (!isRecord(body)) {
		throw new AeroleadsAPIError('Aeroleads returned no profile details', {
			body,
		});
	}

	const status = typeof body.status === 'number' ? body.status : undefined;
	const message = typeof body.message === 'string' ? body.message.trim() : '';

	if (status !== undefined && status >= 400) {
		throw new AeroleadsAPIError(
			message || `Aeroleads request failed with status ${status}`,
			{ status, body },
		);
	}

	if (message.length > 0 && !hasProfileData(body)) {
		throw new AeroleadsAPIError(message, { status, body });
	}

	if (!hasProfileData(body)) {
		throw new AeroleadsAPIError('Aeroleads returned no profile details', {
			body,
		});
	}
}

export async function makeAeroleadsRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query = {} } = options;

	const config: OpenAPIConfig = {
		BASE: AEROLEADS_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: {
			api_key: apiKey,
			...query,
		},
	};

	try {
		const result = await request<T>(config, requestOptions);
		assertAeroleadsSuccess(result);
		return result;
	} catch (error) {
		if (error instanceof ApiError || error instanceof AeroleadsAPIError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new AeroleadsAPIError(error.message);
		}
		throw new AeroleadsAPIError('Unknown error');
	}
}
