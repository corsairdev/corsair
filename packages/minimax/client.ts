import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';
import { z } from 'zod';

export class MinimaxAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'MinimaxAPIError';
	}
}

export const MINIMAX_API_BASE = 'https://api.minimax.io';

// Query values are flat scalars or shallow nested objects: the V2 task-list
// endpoints take `filter[...]` keys, which the shared transport expands from a
// nested object, while repeated keys are expressed as arrays.
export type MinimaxQueryValue =
	| string
	| number
	| boolean
	| undefined
	| readonly (string | number)[]
	| { readonly [key: string]: MinimaxQueryValue };

export type MinimaxRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// Bodies are endpoint-specific JSON (already validated by the zod input
	// schemas before send), so the shared transport stays generic over a JSON
	// record instead of a closed per-endpoint union.
	body?: Record<string, unknown>;
	query?: Record<string, MinimaxQueryValue>;
};

// MiniMax answers many endpoints with HTTP 200 plus a non-zero
// `base_resp.status_code` (see the error-code reference). This envelope lets
// the client turn those into real errors without type assertions; only
// `base_resp` is inspected, the rest of the wire body stays unbounded.
const BaseRespEnvelopeSchema = z
	.object({
		base_resp: z
			.object({
				status_code: z.number(),
				status_msg: z.string().optional(),
			})
			.passthrough(),
	})
	.passthrough();

export async function makeMinimaxRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: MinimaxRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	// An explicitly empty key means no credentials are configured (the
	// keyBuilder resolves that case to ''). Every MiniMax endpoint requires the
	// key, so fail fast with Corsair's missing-auth error instead of sending a
	// request that the provider answers with 401 / status_code 1004.
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('minimax', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: MINIMAX_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Video, music and audio generation are long-running requests that can
		// exceed the shared 20s default.
		TIMEOUT: 60_000,
		HEADERS: {
			'Content-Type': 'application/json',
			...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: body !== undefined ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		const response = await request<T>(config, requestOptions);

		const envelope = BaseRespEnvelopeSchema.safeParse(response);
		if (envelope.success && envelope.data.base_resp.status_code !== 0) {
			const { status_code, status_msg } = envelope.data.base_resp;
			throw new MinimaxAPIError(
				status_msg ?? 'MiniMax request failed',
				String(status_code),
			);
		}

		return response;
	} catch (error) {
		// Rethrow transport errors (ApiError, MinimaxAPIError) untouched so
		// retry-after metadata survives for the plugin's error handlers.
		if (error instanceof Error) {
			throw error;
		}
		throw new MinimaxAPIError('Unknown error');
	}
}
