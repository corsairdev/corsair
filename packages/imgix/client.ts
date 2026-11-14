import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Base URL of the Imgix Management API v1, documented at
 * https://docs.imgix.com/apis/management
 */
export const IMGIX_API_BASE = 'https://api.imgix.com/api/v1';

export class ImgixAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'ImgixAPIError';
	}
}

export type ImgixQuery = Record<string, string | number | boolean | undefined>;

export type ImgixRequest = {
	method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
	path: string;
	query?: ImgixQuery;
	// `unknown` because request body may be arbitrary JSON payload or Blob for uploads
	body?: unknown;
	headers?: Record<string, string>;
};

/**
 * Sends a request to the Imgix Management API.
 *
 * Auth is `Authorization: Bearer <API key>`, documented at
 * https://docs.imgix.com/apis/management.
 */
export async function makeImgixRequest(
	apiKey: string | undefined,
	{ method = 'GET', path, query, body, headers }: ImgixRequest,
): Promise<unknown> {
	// An explicitly empty key means no credentials are configured
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('imgix', 'api_key');
	}

	const authHeaders: Record<string, string> = apiKey
		? { Authorization: `Bearer ${apiKey}` }
		: {};

	// Uploads send raw bytes as a Blob under the file's own content type.
	// Content-Type goes out only with a body (core sets it from mediaType):
	// imgix answers a bodyless POST that carries a JSON Content-Type with
	// 400 "Could not parse JSON from request body".
	const isBinary = body instanceof Blob;
	const { 'Content-Type': requestedType, ...otherHeaders } = headers ?? {};
	const contentType = requestedType ?? 'application/octet-stream';

	const config: OpenAPIConfig = {
		BASE: IMGIX_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/vnd.api+json, application/json',
			...authHeaders,
			...otherHeaders,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		body: method !== 'GET' && body !== undefined ? body : undefined,
		mediaType: isBinary ? contentType : 'application/json; charset=utf-8',
		query,
	};

	try {
		const response = await request<unknown>(config, requestOptions);
		if (typeof response === 'string') {
			try {
				// `unknown` because parsed API response JSON remains untrusted until its endpoint schema validates it.
				const parsedResponse: unknown = JSON.parse(response);
				return parsedResponse;
			} catch {
				return response;
			}
		}
		return response;
	} catch (error) {
		// Drop the request body from errors: it can hold source credentials or
		// customer data (custom fields, alt text). Status and rate-limit fields stay
		// so the error handlers and core retries still work.
		if (error instanceof ApiError && error.request.body !== undefined) {
			const sanitizedError = new ApiError(
				{ ...error.request, body: undefined },
				{
					url: error.url,
					ok: false,
					status: error.status,
					statusText: error.statusText,
					body: error.body,
				},
				error.message,
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
				},
			);
			sanitizedError.stack = error.stack;
			throw sanitizedError;
		}
		if (error instanceof Error) {
			throw error;
		}
		throw new ImgixAPIError('Unknown error');
	}
}
