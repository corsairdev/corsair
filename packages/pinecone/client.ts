import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { ZodType } from 'zod';

export const PINECONE_API_VERSION = '2026-04';
export const PINECONE_CONTROL_BASE = 'https://api.pinecone.io';
export const PINECONE_ASSISTANT_CONTROL_BASE =
	'https://api.pinecone.io/assistant';

export type PineconeSurface =
	| 'control'
	| 'inference'
	| 'index'
	| 'assistant-control'
	| 'assistant-data';

type QueryValue = string | number | boolean | readonly string[] | undefined;

/** Represents client-side validation and transport failures for Pinecone. */
export class PineconeAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'PineconeAPIError';
	}
}

/**
 * Pinecone returns the data-plane host from `describe_index` and the assistant
 * host from `get_assistant`. Accepting an arbitrary URL here would let an agent
 * forward the caller's API key to an unrelated server, so dynamic hosts are
 * limited to HTTPS endpoints under Pinecone's domain.
 */
export function normalizePineconeHost(host: string): string {
	const candidate = host.includes('://') ? host : `https://${host}`;
	let parsed: URL;

	try {
		parsed = new URL(candidate);
	} catch {
		throw new PineconeAPIError('Pinecone host must be a valid URL or hostname');
	}

	if (
		parsed.protocol !== 'https:' ||
		(parsed.hostname !== 'pinecone.io' &&
			!parsed.hostname.endsWith('.pinecone.io'))
	) {
		throw new PineconeAPIError(
			'Pinecone host must use HTTPS and end in pinecone.io',
		);
	}

	if (
		parsed.username ||
		parsed.password ||
		parsed.search ||
		parsed.hash ||
		(parsed.pathname !== '' && parsed.pathname !== '/')
	) {
		throw new PineconeAPIError(
			'Pinecone host must not include credentials, paths, query parameters, or fragments',
		);
	}

	return parsed.origin;
}

/** Resolves a Pinecone API surface to its fixed or validated dynamic base URL. */
function resolveBase(surface: PineconeSurface, host?: string): string {
	switch (surface) {
		case 'control':
		case 'inference':
			return PINECONE_CONTROL_BASE;
		case 'assistant-control':
			return PINECONE_ASSISTANT_CONTROL_BASE;
		case 'index':
		case 'assistant-data':
			if (!host) {
				throw new PineconeAPIError(
					`A Pinecone ${surface} host is required for this operation`,
				);
			}
			return normalizePineconeHost(host);
	}
}

/** Sends a version-pinned request and validates the provider response. */
export async function makePineconeRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: unknown;
		query?: Record<string, QueryValue>;
		surface?: PineconeSurface;
		host?: string;
		mediaType?: string;
		schema?: ZodType<T>;
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		surface = 'control',
		host,
		mediaType: requestedMediaType,
		schema,
	} = options;
	const mediaType =
		requestedMediaType ??
		(typeof FormData !== 'undefined' && body instanceof FormData
			? undefined
			: 'application/json; charset=utf-8');

	if (!apiKey) {
		throw new PineconeAPIError('Pinecone API key is required');
	}

	const definedQuery = query
		? Object.fromEntries(
				Object.entries(query).filter(([, value]) => value !== undefined),
			)
		: undefined;

	const config: OpenAPIConfig = {
		BASE: resolveBase(surface, host),
		VERSION: PINECONE_API_VERSION,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Do not set TOKEN: Corsair's shared transport would turn it into a
		// Bearer header. Pinecone authenticates these surfaces with Api-Key.
		HEADERS: {
			'Api-Key': apiKey,
			'X-Pinecone-API-Version': PINECONE_API_VERSION,
			...(mediaType?.startsWith('application/json')
				? { 'Content-Type': 'application/json' }
				: {}),
		},
	};

	const sendsBody = method === 'POST' || method === 'PUT' || method === 'PATCH';
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: sendsBody ? body : undefined,
		mediaType,
		query:
			definedQuery && Object.keys(definedQuery).length > 0
				? definedQuery
				: undefined,
	};

	let response: unknown;
	try {
		response = await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) throw error;
		if (error instanceof Error) {
			throw new PineconeAPIError(error.message);
		}
		throw new PineconeAPIError('Unknown Pinecone API error');
	}

	if (!schema) return response as T;

	const parsed = schema.safeParse(response);
	if (!parsed.success) {
		throw new PineconeAPIError(
			`Pinecone returned a response that did not match the documented schema for ${endpoint}: ${parsed.error.message}`,
			'INVALID_RESPONSE',
		);
	}

	return parsed.data;
}
