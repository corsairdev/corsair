import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export type GongCredentials =
	| { type: 'basic'; accessKey: string; accessKeySecret: string }
	| { type: 'bearer'; accessToken: string };

export type GongRequestOptions = {
	baseUrl: string;
	credentials: GongCredentials;
	apiKey?: string;
	method: ApiRequestOptions['method'];
	path: string;
	query?: Record<string, unknown>;
	body?: unknown;
	formData?: Record<string, Blob | string>;
};

export async function gongRequest<T>(options: GongRequestOptions): Promise<T> {
	const { baseUrl, credentials, method, path, query, body } = options;
	const authorization =
		credentials.type === 'basic'
			? `Basic ${Buffer.from(`${credentials.accessKey}:${credentials.accessKeySecret}`).toString('base64')}`
			: `Bearer ${credentials.accessToken}`;
	const config: OpenAPIConfig = {
		BASE: baseUrl.replace(/\/$/, ''),
		VERSION: 'V2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS:
			credentials.type === 'basic' ? {} : { Authorization: authorization },
		...(credentials.type === 'basic'
			? {
					USERNAME: credentials.accessKey,
					PASSWORD: credentials.accessKeySecret,
				}
			: {}),
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		formData: options.formData,
		mediaType: body === undefined ? undefined : 'application/json',
	};
	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) throw error;
		throw new Error(
			error instanceof Error ? error.message : 'Unknown Gong API error',
		);
	}
}
