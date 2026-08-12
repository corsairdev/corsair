import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { ApifyOperationDefinition } from './endpoints/operations';
import type {
	ApifyOperationInput,
	ApifyOperationOutput,
} from './endpoints/rest-types';

export class ApifyAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'ApifyAPIError';
	}
}

const APIFY_API_BASE = 'https://api.apify.com';

const RESERVED_INPUT_KEYS = new Set([
	'body',
	'query',
	'headers',
	'contentType',
	'mediaType',
]);

// Apify JSON payloads are endpoint-specific and passed through unchanged.
type ApifyJsonValue = unknown;
type ApifyJsonRecord = Record<string, ApifyJsonValue>;

function isRecord(value: ApifyJsonValue): value is ApifyJsonRecord {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function pickDefined(
	input: ApifyOperationInput,
	keys: readonly string[] | undefined,
): ApifyJsonRecord | undefined {
	if (!keys?.length) return undefined;

	const output: ApifyJsonRecord = {};
	for (const key of keys) {
		const value = input[key];
		if (value !== undefined) output[key] = value;
	}

	return Object.keys(output).length > 0 ? output : undefined;
}

function buildQuery(
	operation: ApifyOperationDefinition,
	input: ApifyOperationInput,
): ApifyJsonRecord | undefined {
	const query = {
		...(isRecord(input.query) ? input.query : {}),
		...(pickDefined(input, operation.queryParams) ?? {}),
	};

	return Object.keys(query).length > 0 ? query : undefined;
}

function buildBody(
	operation: ApifyOperationDefinition,
	input: ApifyOperationInput,
): ApifyJsonValue {
	if (input.body !== undefined) return input.body;
	if (operation.method === 'GET' || operation.method === 'HEAD')
		return undefined;

	const queryParams = new Set(operation.queryParams ?? []);
	const pathParams = new Set(operation.pathParams);
	const body: ApifyJsonRecord = {};

	for (const [key, value] of Object.entries(input)) {
		if (
			value === undefined ||
			RESERVED_INPUT_KEYS.has(key) ||
			queryParams.has(key) ||
			pathParams.has(key)
		) {
			continue;
		}

		body[key] = value;
	}

	return Object.keys(body).length > 0 ? body : undefined;
}

export async function makeApifyRequest(
	operation: ApifyOperationDefinition,
	apiKey: string,
	input: ApifyOperationInput = {},
): Promise<ApifyOperationOutput> {
	const config: OpenAPIConfig = {
		BASE: APIFY_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
		},
		ENCODE_PATH: encodeURIComponent,
	};

	const body = buildBody(operation, input);
	const mediaType =
		input.mediaType ?? input.contentType ?? 'application/json; charset=utf-8';
	const headers = isRecord(input.headers) ? input.headers : undefined;

	const requestOptions: ApiRequestOptions = {
		method: operation.method,
		url: operation.path,
		path: pickDefined(input, operation.pathParams),
		query: buildQuery(operation, input),
		headers,
		body,
		mediaType: body === undefined ? undefined : mediaType,
	};

	try {
		const response = await request<ApifyJsonValue>(config, requestOptions);
		if (response === undefined && operation.method === 'HEAD') {
			return { exists: true };
		}
		if (response === undefined) return { success: true };
		return response;
	} catch (error) {
		if (
			error instanceof ApiError &&
			operation.method === 'HEAD' &&
			error.status === 404
		) {
			return { exists: false };
		}
		if (error instanceof ApiError) throw error;
		if (error instanceof Error) throw new ApifyAPIError(error.message);
		throw new ApifyAPIError('Unknown error');
	}
}
