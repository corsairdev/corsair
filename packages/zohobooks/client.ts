import type {
	ApiRequestOptions,
	ApiResult,
	BinaryResponse,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { openApiSchemas } from './openapi';
import type {
	JsonValue,
	ZohoBooksOperationDefinition,
	ZohoBooksOperationInput,
	ZohoBooksOperationOutput,
	ZohoBooksRegion,
} from './schema/openapi-types';
import {
	isJsonValue,
	isZohoBooksJsonObject,
} from './schema/openapi-validation';

const REGION_DOMAIN: Record<ZohoBooksRegion, string> = {
	us: 'com',
	eu: 'eu',
	in: 'in',
	au: 'com.au',
	jp: 'jp',
	ca: 'ca',
	sa: 'sa',
	ae: 'ae',
	cn: 'com.cn',
};

const REGION_ACCOUNTS_DOMAIN: Record<ZohoBooksRegion, string> = {
	us: 'accounts.zoho.com',
	eu: 'accounts.zoho.eu',
	in: 'accounts.zoho.in',
	au: 'accounts.zoho.com.au',
	jp: 'accounts.zoho.jp',
	ca: 'accounts.zohocloud.ca',
	sa: 'accounts.zoho.sa',
	ae: 'accounts.zoho.ae',
	cn: 'accounts.zoho.com.cn',
};

export const MAX_BINARY_RESPONSE_BYTES = 10 * 1024 * 1024;

export class ZohoBooksResponseTooLargeError extends Error {
	constructor() {
		super(
			`Zoho Books binary response exceeded the ${MAX_BINARY_RESPONSE_BYTES}-byte plugin limit.`,
		);
		this.name = 'ZohoBooksResponseTooLargeError';
	}
}

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

export function zohoBooksApiBase(region: ZohoBooksRegion = 'us'): string {
	return `https://www.zohoapis.${REGION_DOMAIN[region]}/books/v3`;
}

export function zohoBooksOAuthAuthUrl(region: ZohoBooksRegion = 'us'): string {
	return `https://${REGION_ACCOUNTS_DOMAIN[region]}/oauth/v2/auth`;
}

export function zohoBooksOAuthTokenUrl(region: ZohoBooksRegion = 'us'): string {
	return `https://${REGION_ACCOUNTS_DOMAIN[region]}/oauth/v2/token`;
}

export type ZohoBooksRequestContext = {
	key: string;
	options: { region?: ZohoBooksRegion };
};

const MAX_ERROR_MESSAGE_LENGTH = 300;

// Zoho's error messages name the failing field ("Invalid value passed for
// account_id"), which callers need to fix a request. They can also quote a
// value the caller sent, so email addresses are masked and the text is capped.
function safeZohoBooksErrorMessage(error: ApiError): string | undefined {
	// `unknown` because provider error bodies are untrusted until checked.
	const body: unknown = error.body;
	if (!isJsonValue(body) || !isZohoBooksJsonObject(body)) return undefined;
	const message = body.message;
	if (typeof message !== 'string' || !message.trim()) return undefined;
	const masked = message
		.replace(/[^\s@()<>"',;]+@[^\s@()<>"',;]+/g, '[email]')
		.replace(/\s+/g, ' ')
		.trim();
	return masked.length > MAX_ERROR_MESSAGE_LENGTH
		? `${masked.slice(0, MAX_ERROR_MESSAGE_LENGTH - 1)}…`
		: masked;
}

function sanitizeApiError(
	error: ApiError,
	operation: ZohoBooksOperationDefinition,
	region: ZohoBooksRegion | undefined,
): ApiError {
	const safeRequest: ApiRequestOptions = {
		method: operation.method,
		url: operation.path,
	};
	const code = getZohoBooksApiErrorCode(error);
	const message = safeZohoBooksErrorMessage(error);
	const safeResponse: ApiResult = {
		url: `${zohoBooksApiBase(region)}${operation.path}`,
		ok: false,
		status: error.status,
		statusText: error.statusText,
		body: {
			...(code !== undefined ? { code } : {}),
			message: message ?? 'Zoho Books returned no error message.',
		},
	};
	return new ApiError(
		safeRequest,
		safeResponse,
		`Zoho Books API request failed with HTTP ${error.status}${
			code !== undefined ? ` (code ${code})` : ''
		}${message ? `: ${message}` : '.'}`,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

export function getZohoBooksApiErrorCode(
	error: Error,
): string | number | undefined {
	if (!(error instanceof ApiError)) return undefined;
	// `unknown` because provider error bodies are untrusted until checked.
	const body: unknown = error.body;
	if (!isJsonValue(body) || !isZohoBooksJsonObject(body)) return undefined;
	const code = body.code;
	return typeof code === 'number' || typeof code === 'string'
		? code
		: undefined;
}

function encodeQueryParameter(
	parameter: ZohoBooksOperationDefinition['parameters'][number],
	value: JsonValue,
): JsonValue {
	if (Array.isArray(value)) {
		const style = parameter.style ?? 'form';
		const explode = parameter.explode ?? style === 'form';
		if (explode) return value;
		const separator =
			style === 'pipeDelimited' ? '|' : style === 'spaceDelimited' ? ' ' : ',';
		return value.map((part) => String(part)).join(separator);
	}
	if (
		value !== null &&
		typeof value === 'object' &&
		parameter.style === 'form' &&
		parameter.explode === false
	) {
		return Object.entries(value)
			.flatMap(([key, part]) => [key, String(part)])
			.join(',');
	}
	return value;
}

function isBinaryParameter(
	parameter: ZohoBooksOperationDefinition['parameters'][number],
): boolean {
	return (
		parameter.schema !== undefined &&
		isZohoBooksJsonObject(parameter.schema) &&
		parameter.schema.format === 'binary'
	);
}

function resolveSchemaReference(
	operation: ZohoBooksOperationDefinition,
	schema: JsonValue,
): JsonValue | undefined {
	if (!isZohoBooksJsonObject(schema) || typeof schema.$ref !== 'string')
		return schema;
	const name = schema.$ref.match(/^#\/components\/schemas\/([^/]+)$/)?.[1];
	if (!name) return undefined;
	// `unknown` because group schemas come from the provider-generated registry.
	const groupSchemas: unknown = Reflect.get(openApiSchemas, operation.group);
	if (!isJsonValue(groupSchemas) || !isZohoBooksJsonObject(groupSchemas))
		return undefined;
	return groupSchemas[name];
}

function isBinarySchema(
	operation: ZohoBooksOperationDefinition,
	schemaInput: JsonValue,
	depth = 0,
): boolean {
	if (depth > 16 || !isZohoBooksJsonObject(schemaInput)) return false;
	const schema = resolveSchemaReference(operation, schemaInput);
	if (!schema || !isZohoBooksJsonObject(schema)) return false;
	if (schema.format === 'binary') return true;
	if (
		isJsonValue(schema.items) &&
		isBinarySchema(operation, schema.items, depth + 1)
	)
		return true;
	for (const key of ['oneOf', 'anyOf', 'allOf']) {
		const branches = schema[key];
		if (
			Array.isArray(branches) &&
			branches.some(
				(branch) =>
					isJsonValue(branch) && isBinarySchema(operation, branch, depth + 1),
			)
		)
			return true;
	}
	return false;
}

function binaryBodyFieldNames(
	operation: ZohoBooksOperationDefinition,
): Set<string> {
	const requestSchema = operation.request?.schema;
	if (requestSchema === undefined) return new Set();
	const resolved = resolveSchemaReference(operation, requestSchema);
	if (!resolved || !isZohoBooksJsonObject(resolved)) return new Set();
	const properties = resolved.properties;
	if (properties === undefined || !isZohoBooksJsonObject(properties))
		return new Set();
	return new Set(
		Object.entries(properties)
			.filter(([, schema]) => isBinarySchema(operation, schema))
			.map(([key]) => key),
	);
}

function requestQuery(
	operation: ZohoBooksOperationDefinition,
	input: ZohoBooksOperationInput,
): Record<string, JsonValue> | undefined {
	if (!input.query) return undefined;
	const query: Record<string, JsonValue> = {};
	for (const [key, value] of Object.entries(input.query)) {
		const parameter = operation.parameters.find(
			(candidate) => candidate.in === 'query' && candidate.name === key,
		);
		if (parameter && isBinaryParameter(parameter)) continue;
		query[key] = parameter ? encodeQueryParameter(parameter, value) : value;
	}
	return query;
}

function requestHeaders(
	operation: ZohoBooksOperationDefinition,
	input: ZohoBooksOperationInput,
): Record<string, string> {
	const headers: Record<string, string> = {};
	for (const [key, value] of Object.entries(input.headers ?? {})) {
		const parameter = operation.parameters.find(
			(candidate) => candidate.in === 'header' && candidate.name === key,
		);
		const serialized = parameter
			? encodeQueryParameter(parameter, value)
			: value;
		headers[key] = Array.isArray(serialized)
			? serialized.map(String).join(',')
			: typeof serialized === 'object' && serialized !== null
				? JSON.stringify(serialized)
				: String(serialized);
	}
	return headers;
}

function decodeBase64(value: string): Uint8Array {
	const decoded = atob(value);
	const bytes = new Uint8Array(decoded.length);
	for (let index = 0; index < decoded.length; index++) {
		bytes[index] = decoded.charCodeAt(index);
	}
	return bytes;
}

function toFormData(
	operation: ZohoBooksOperationDefinition,
	input: ZohoBooksOperationInput,
): Record<string, string | Blob> | undefined {
	const bodyIsMultipart =
		operation.request?.mediaType === 'multipart/form-data';
	const binaryBodyFields = binaryBodyFieldNames(operation);
	const binaryQueryParameters = operation.parameters.filter(
		(parameter) =>
			parameter.in === 'query' &&
			isBinaryParameter(parameter) &&
			input.query?.[parameter.name] !== undefined,
	);
	if (
		!bodyIsMultipart &&
		binaryQueryParameters.length === 0 &&
		binaryBodyFields.size === 0
	)
		return undefined;
	const formData: Record<string, string | Blob> = {};
	const appendValue = (key: string, value: JsonValue, isBinary: boolean) => {
		if (isZohoBooksJsonObject(value)) {
			const filename = value.filename;
			const contentType = value.contentType;
			const base64 = value.base64;
			if (
				typeof filename === 'string' &&
				typeof contentType === 'string' &&
				typeof base64 === 'string'
			) {
				formData[key] = new File([decodeBase64(base64)], filename, {
					type: contentType,
				});
				return;
			}
		}
		if (isBinary && typeof value === 'string') {
			formData[key] = new Blob([value]);
			return;
		}
		formData[key] = typeof value === 'string' ? value : JSON.stringify(value);
	};
	if (
		bodyIsMultipart &&
		input.body !== undefined &&
		isZohoBooksJsonObject(input.body)
	) {
		for (const [key, value] of Object.entries(input.body))
			appendValue(key, value, binaryBodyFields.has(key));
	} else if (
		(binaryQueryParameters.length > 0 || binaryBodyFields.size > 0) &&
		input.body !== undefined &&
		isZohoBooksJsonObject(input.body)
	) {
		// Zoho's multipart APIs carry non-file JSON arguments in the JSONString part.
		const jsonBody = Object.fromEntries(
			Object.entries(input.body).filter(([key]) => !binaryBodyFields.has(key)),
		);
		if (Object.keys(jsonBody).length > 0)
			formData.JSONString = JSON.stringify(jsonBody);
		for (const key of binaryBodyFields) {
			const value = input.body[key];
			if (value !== undefined) appendValue(key, value, true);
		}
	}
	for (const parameter of binaryQueryParameters) {
		const value = input.query?.[parameter.name];
		if (value !== undefined) appendValue(parameter.name, value, true);
	}
	return formData;
}

function encodeBase64(bytes: Uint8Array): string {
	let binary = '';
	for (let offset = 0; offset < bytes.length; offset += 0x8000) {
		binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
	}
	return btoa(binary);
}

function supportsBinaryResponse(
	operation: ZohoBooksOperationDefinition,
): boolean {
	return operation.responses.some(
		(response) =>
			response.contentType === '*/*' ||
			(response.contentType !== 'application/x-empty' &&
				!response.contentType.includes('json')),
	);
}

function binaryResult(
	contentTypeHeader: string | null,
	bytes: Uint8Array,
): ZohoBooksOperationOutput {
	if (bytes.byteLength > MAX_BINARY_RESPONSE_BYTES) {
		throw new ZohoBooksResponseTooLargeError();
	}
	const contentType = contentTypeHeader ?? 'application/octet-stream';
	if (contentType.toLowerCase().includes('json')) {
		// `unknown` because parsed JSON is provider data until the endpoint schema validates it.
		const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes));
		if (!isJsonValue(parsed))
			throw new Error('Zoho Books returned invalid JSON.');
		return parsed;
	}
	return {
		kind: 'binary',
		contentType,
		base64: encodeBase64(bytes),
		byteLength: bytes.byteLength,
	};
}

function appendQueryValue(
	query: URLSearchParams,
	key: string,
	value: JsonValue,
): void {
	if (Array.isArray(value)) {
		for (const item of value) appendQueryValue(query, key, item);
		return;
	}
	if (value !== null && typeof value === 'object') {
		for (const [nestedKey, nestedValue] of Object.entries(value)) {
			appendQueryValue(query, `${key}[${nestedKey}]`, nestedValue);
		}
		return;
	}
	query.append(key, String(value));
}

function binaryRequestUrl(
	operation: ZohoBooksOperationDefinition,
	input: ZohoBooksOperationInput,
	region: ZohoBooksRegion | undefined,
): URL {
	const path = operation.path.replace(/{([^{}]+)}/g, (_match, name: string) => {
		const value = input.pathParams?.[name];
		if (value === undefined)
			throw new Error(`Missing path parameter ${name} for ${operation.id}.`);
		return encodeURIComponent(String(value));
	});
	const url = new URL(`${zohoBooksApiBase(region)}${path}`);
	for (const [key, value] of Object.entries(
		requestQuery(operation, input) ?? {},
	)) {
		appendQueryValue(url.searchParams, key, value);
	}
	return url;
}

async function readErrorBody(response: Response): Promise<JsonValue> {
	const text = await response.text();
	if (!text)
		return { message: response.statusText || 'Zoho Books request failed.' };
	if (response.headers.get('content-type')?.toLowerCase().includes('json')) {
		try {
			// `unknown` because error JSON is provider-controlled until checked.
			const parsed: unknown = JSON.parse(text);
			if (isJsonValue(parsed)) return parsed;
		} catch {
			return { message: 'Zoho Books returned an invalid error response.' };
		}
	}
	return { message: text.slice(0, 512) };
}

function retryAfterMilliseconds(response: Response): number | undefined {
	const retryAfter = response.headers.get('retry-after');
	if (!retryAfter) return undefined;
	const seconds = Number.parseInt(retryAfter, 10);
	if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
	const timestamp = Date.parse(retryAfter);
	return Number.isFinite(timestamp)
		? Math.max(0, timestamp - Date.now())
		: undefined;
}

async function readBinaryResponse(response: Response): Promise<BinaryResponse> {
	const reader = response.body?.getReader();
	if (!reader) {
		return {
			bytes: new Uint8Array(0),
			contentType: response.headers.get('content-type'),
		};
	}
	const chunks: Uint8Array[] = [];
	let byteLength = 0;
	while (true) {
		const result = await reader.read();
		if (result.done) break;
		if (!result.value) continue;
		byteLength += result.value.byteLength;
		if (byteLength > MAX_BINARY_RESPONSE_BYTES) {
			// Best-effort: cancelling a file stream may reject after a size limit.
			await reader.cancel().catch(() => undefined);
			throw new ZohoBooksResponseTooLargeError();
		}
		chunks.push(result.value);
	}
	const bytes = new Uint8Array(byteLength);
	let offset = 0;
	for (const chunk of chunks) {
		bytes.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return { bytes, contentType: response.headers.get('content-type') };
}

async function fetchZohoBooksBinary(
	ctx: ZohoBooksRequestContext,
	operation: ZohoBooksOperationDefinition,
	input: ZohoBooksOperationInput,
): Promise<ZohoBooksOperationOutput> {
	const url = binaryRequestUrl(operation, input, ctx.options.region);
	const response = await fetch(url, {
		method: operation.method,
		headers: {
			...requestHeaders(operation, input),
			Authorization: `Zoho-oauthtoken ${ctx.key}`,
		},
		credentials: 'omit',
		signal: AbortSignal.timeout(20_000),
	});
	if (!response.ok) {
		let body: JsonValue;
		try {
			body = await readErrorBody(response);
		} catch {
			body = { message: 'Zoho Books binary request failed.' };
		}
		const result: ApiResult = {
			url: url.toString(),
			ok: false,
			status: response.status,
			statusText: response.statusText,
			body,
		};
		throw new ApiError(
			{ method: operation.method, url: operation.path },
			result,
			response.statusText ||
				`Zoho Books request failed with HTTP ${response.status}.`,
			{ retryAfter: retryAfterMilliseconds(response) },
		);
	}
	const responseBody = await readBinaryResponse(response);
	return binaryResult(responseBody.contentType, responseBody.bytes);
}

export async function makeZohoBooksRequest(
	ctx: ZohoBooksRequestContext,
	operation: ZohoBooksOperationDefinition,
	input: ZohoBooksOperationInput,
): Promise<ZohoBooksOperationOutput> {
	const config: OpenAPIConfig = {
		BASE: zohoBooksApiBase(ctx.options.region),
		VERSION: '3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		ENCODE_PATH: encodeURIComponent,
		TOKEN: undefined,
		HEADERS: {
			...requestHeaders(operation, input),
			Authorization: `Zoho-oauthtoken ${ctx.key}`,
		},
	};
	const hasBinaryQueryInput = operation.parameters.some(
		(parameter) =>
			parameter.in === 'query' &&
			isBinaryParameter(parameter) &&
			input.query?.[parameter.name] !== undefined,
	);
	const hasBinaryBodyInput = [...binaryBodyFieldNames(operation)].some(
		(name) =>
			input.body !== undefined &&
			isZohoBooksJsonObject(input.body) &&
			input.body[name] !== undefined,
	);
	const requestOptions: ApiRequestOptions = {
		method: operation.method,
		url: operation.path,
		path: input.pathParams,
		query: requestQuery(operation, input),
		...(operation.request?.mediaType === 'multipart/form-data' ||
		hasBinaryQueryInput ||
		hasBinaryBodyInput
			? { formData: toFormData(operation, input) }
			: input.body !== undefined
				? { body: input.body, mediaType: operation.request?.mediaType }
				: {}),
	};

	try {
		if (supportsBinaryResponse(operation)) {
			return await fetchZohoBooksBinary(ctx, operation, input);
		}
		// `unknown` because provider JSON is untrusted until the operation schema parses it.
		const response: unknown = await request<unknown>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
		if (response === undefined) return null;
		if (!isJsonValue(response))
			throw new Error('Zoho Books returned invalid JSON.');
		return response;
	} catch (error: unknown) {
		// Provider and transport errors can echo customer data from request URLs or bodies.
		if (error instanceof ApiError)
			throw sanitizeApiError(error, operation, ctx.options.region);
		if (
			error instanceof Error &&
			error.name === 'ZohoBooksResponseTooLargeError'
		)
			throw error;
		throw new Error(
			`Zoho Books request failed (${operation.method} ${operation.path}).`,
		);
	}
}
