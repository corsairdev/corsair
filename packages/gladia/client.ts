import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

const GLADIA_API_BASE = 'https://api.gladia.io';

export class GladiaAPIError extends Error {
	public readonly status?: number;
	// unknown is necessary because Gladia error payloads vary by endpoint; a closed error body union is infeasible because v2 does not publish one schema for failures
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	// unknown is necessary because the cause can be any thrown value from the transport; a closed error union is infeasible because fetch failures are untyped
	constructor(message: string, cause?: unknown) {
		super(message, cause instanceof Error ? { cause } : undefined);
		this.name = 'GladiaAPIError';
		if (cause instanceof ApiError) {
			this.status = cause.status;
			this.body = cause.body;
			this.retryAfter = cause.retryAfter;
		}
	}
}

type GladiaRequestOptions = {
	method?: 'GET' | 'POST' | 'DELETE';
	// unknown is necessary because write bodies are operation-specific JSON bags; a closed union of nine payload shapes is infeasible because the transport is shared
	body?: unknown;
	// unknown is necessary because query values include nested filter records; a closed query-value union is infeasible because list filters are provider-defined
	query?: Record<string, unknown>;
};

function config(
	apiKey: string,
	contentType = 'application/json',
): OpenAPIConfig {
	return {
		BASE: GLADIA_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'x-gladia-key': apiKey,
			...(contentType ? { 'Content-Type': contentType } : {}),
		},
	};
}

export async function makeGladiaRequest<T>(
	endpoint: string,
	apiKey: string,
	options: GladiaRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' ? body : undefined,
		query,
		mediaType:
			body === undefined ? undefined : 'application/json; charset=utf-8',
	};
	try {
		return await request<T>(config(apiKey), requestOptions);
	} catch (error) {
		if (error instanceof Error) throw new GladiaAPIError(error.message, error);
		throw new GladiaAPIError('Unknown Gladia API error');
	}
}

export async function uploadGladiaFile<T>(
	audio: Blob,
	apiKey: string,
	filename?: string,
): Promise<T> {
	const form = new FormData();
	form.append('audio', audio, filename);
	try {
		return await request<T>(config(apiKey, ''), {
			method: 'POST',
			url: '/v2/upload',
			body: form,
		});
	} catch (error) {
		if (error instanceof Error) throw new GladiaAPIError(error.message, error);
		throw new GladiaAPIError('Unknown Gladia API error');
	}
}
