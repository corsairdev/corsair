import type { OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { z } from 'zod';
import { SHIPENGINE_OPERATIONS } from './endpoints/operations';
import type {
	ShipEngineEndpointInputs,
	ShipEngineEndpointOutputs,
	ShipEngineOperationName,
} from './endpoints/types';
import {
	ShipEngineEndpointInputSchemas,
	ShipEngineEndpointOutputSchemas,
} from './endpoints/types';

export type ShipEngineRegion = 'us' | 'eu';

const BASE_URLS: Record<ShipEngineRegion, string> = {
	us: 'https://api.shipengine.com',
	eu: 'https://api.eu.shipengine.com',
};

const DOWNLOAD_MAX_BYTES = 50 * 1024 * 1024;
const RATE_LIMIT_RETRIES = 3;

function isRecord(value: unknown): value is Record<string, unknown> {
	// `unknown` because parsed endpoint input is runtime data until the strict Zod schema has validated it.
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseWithSchema<Schema extends z.ZodType>(
	schema: Schema,
	value: unknown,
): z.infer<Schema> {
	// `unknown` because HTTP and binary response data is untrusted until the operation's Zod schema parses it.
	return schema.parse(value);
}

function inputSection(input: object, key: 'path' | 'query' | 'body'): unknown {
	// `unknown` because each strict operation input has a different set of path, query, and body sections.
	return Object.fromEntries(Object.entries(input))[key];
}

type ShipEngineQueryValue =
	| string
	| number
	| boolean
	| readonly (string | number | boolean)[]
	| undefined;

function serializeQuery(
	operationName: ShipEngineOperationName,
	value: unknown,
): Record<string, ShipEngineQueryValue> {
	// `unknown` because the operation-specific query shape is selected by its strict input schema.
	const result: Record<string, ShipEngineQueryValue> = {};
	if (!isRecord(value)) return result;
	const operation = SHIPENGINE_OPERATIONS[operationName];
	for (const [key, item] of Object.entries(value)) {
		if (item === undefined || item === null) continue;
		if (Array.isArray(item)) {
			const values = item.filter(
				(entry): entry is string | number | boolean =>
					typeof entry === 'string' ||
					typeof entry === 'number' ||
					typeof entry === 'boolean',
			);
			const parameter = operation.queryParameters.find(
				(queryParameter) => queryParameter.name === key,
			);
			result[key] =
				parameter?.explode === false ? values.map(String).join(',') : values;
		} else if (
			typeof item === 'string' ||
			typeof item === 'number' ||
			typeof item === 'boolean'
		) {
			result[key] = item;
		}
	}
	return result;
}

function buildPath(
	operationName: ShipEngineOperationName,
	pathInput: unknown,
): string {
	// `unknown` because path parameters are read from a generic endpoint input after Zod validation.
	const operation = SHIPENGINE_OPERATIONS[operationName];
	const pathValues = isRecord(pathInput) ? pathInput : {};
	return operation.path.replace(/\{([^}]+)\}/g, (_match, name: string) => {
		const value = pathValues[name];
		if (typeof value !== 'string' || value.length === 0) {
			throw new Error(`Missing ShipEngine path parameter: ${name}`);
		}
		return encodeURIComponent(value);
	});
}

function parseRetryAfter(response: Response): number | undefined {
	const value = response.headers.get('retry-after');
	if (!value) return undefined;
	const seconds = Number.parseInt(value, 10);
	return Number.isFinite(seconds) && seconds >= 0 ? seconds * 1000 : undefined;
}

async function retryDelay(milliseconds: number): Promise<void> {
	await new Promise<void>((resolve) =>
		globalThis.setTimeout(resolve, milliseconds),
	);
}

function toBase64(bytes: Uint8Array): string {
	let binary = '';
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return globalThis.btoa(binary);
}

async function readBytes(response: Response): Promise<Uint8Array> {
	const reader = response.body?.getReader();
	if (!reader) return new Uint8Array();
	const chunks: Uint8Array[] = [];
	let byteLength = 0;
	while (true) {
		const part = await reader.read();
		if (part.done) break;
		if (!part.value) continue;
		byteLength += part.value.byteLength;
		if (byteLength > DOWNLOAD_MAX_BYTES) {
			await reader.cancel();
			throw new Error(
				`ShipEngine download exceeds the ${DOWNLOAD_MAX_BYTES}-byte safety limit`,
			);
		}
		chunks.push(part.value);
	}
	const bytes = new Uint8Array(byteLength);
	let offset = 0;
	for (const chunk of chunks) {
		bytes.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return bytes;
}

async function downloadFile(
	apiKey: string,
	region: ShipEngineRegion,
	input: object,
): Promise<ShipEngineEndpointOutputs['downloads.downloadFile']> {
	const operationName = 'downloads.downloadFile';
	const path = buildPath(operationName, inputSection(input, 'path'));
	const url = new URL(path, BASE_URLS[region]);
	for (const [key, value] of Object.entries(
		serializeQuery(operationName, inputSection(input, 'query')),
	)) {
		if (Array.isArray(value)) {
			for (const item of value) url.searchParams.append(key, String(item));
		} else if (value !== undefined) {
			url.searchParams.set(key, String(value));
		}
	}
	for (let attempt = 0; attempt <= RATE_LIMIT_RETRIES; attempt += 1) {
		let response: Response;
		try {
			response = await fetch(url, {
				method: 'GET',
				headers: {
					'API-Key': apiKey,
					Accept: 'application/pdf, image/png, application/zpl',
				},
				signal: AbortSignal.timeout(20_000),
			});
		} catch {
			throw new Error(
				'ShipEngine file download failed before a response was received',
			);
		}
		if (response.status === 429 && attempt < RATE_LIMIT_RETRIES) {
			await response.body?.cancel().catch(() => undefined);
			await retryDelay(parseRetryAfter(response) ?? 1000 * (attempt + 1));
			continue;
		}
		if (!response.ok) {
			await response.body?.cancel().catch(() => undefined);
			throw new ApiError(
				{ method: 'GET', url: 'https://api.shipengine.com' },
				{
					url: 'https://api.shipengine.com',
					ok: false,
					status: response.status,
					statusText: response.statusText,
					body: undefined,
				},
				`ShipEngine API request failed with HTTP ${response.status}`,
				{ retryAfter: parseRetryAfter(response) },
			);
		}
		const bytes = await readBytes(response);
		const contentType = response.headers
			.get('content-type')
			?.split(';')[0]
			?.trim();
		if (
			contentType !== 'application/pdf' &&
			contentType !== 'image/png' &&
			contentType !== 'application/zpl'
		) {
			throw new Error(
				'ShipEngine returned an unsupported label document format',
			);
		}
		// `unknown` because fetch bytes are converted to a transport-neutral object before the output schema validates it.
		const result: unknown = {
			kind: 'binary',
			contentType,
			base64: toBase64(bytes),
			byteLength: bytes.byteLength,
		};
		return parseWithSchema(
			ShipEngineEndpointOutputSchemas[operationName],
			result,
		);
	}
	throw new Error(
		'ShipEngine file download exceeded the documented rate-limit retry count',
	);
}

export function makeShipEngineRequest<K extends ShipEngineOperationName>(
	operationName: K,
	apiKey: string,
	input: ShipEngineEndpointInputs[K],
	region?: ShipEngineRegion,
): Promise<ShipEngineEndpointOutputs[K]>;
export async function makeShipEngineRequest(
	operationName: ShipEngineOperationName,
	apiKey: string,
	input: ShipEngineEndpointInputs[ShipEngineOperationName],
	region: ShipEngineRegion = 'us',
): Promise<ShipEngineEndpointOutputs[ShipEngineOperationName]> {
	if (apiKey.length === 0) {
		throw new Error('ShipEngine API key is required');
	}
	const operation = SHIPENGINE_OPERATIONS[operationName];
	const validatedInput =
		ShipEngineEndpointInputSchemas[operationName].parse(input);
	if (operationName === 'downloads.downloadFile') {
		return downloadFile(apiKey, region, validatedInput);
	}
	const path = buildPath(operationName, inputSection(validatedInput, 'path'));
	const query = serializeQuery(
		operationName,
		inputSection(validatedInput, 'query'),
	);
	const config: OpenAPIConfig = {
		BASE: BASE_URLS[region],
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'API-Key': apiKey,
			'Content-Type': 'application/json',
		},
	};
	try {
		// `unknown` because the provider response is untrusted until parsed by the operation-specific schema.
		const response: unknown = await request<unknown>(config, {
			method: operation.method,
			url: path,
			query,
			body: inputSection(validatedInput, 'body'),
			mediaType: operation.hasBody ? 'application/json' : undefined,
		});
		return parseWithSchema(
			ShipEngineEndpointOutputSchemas[operationName],
			response,
		);
	} catch (error: unknown) {
		// `unknown` because JavaScript promises may reject with any value; ApiError is narrowed before handling.
		if (error instanceof ApiError) throw error;
		throw new Error('ShipEngine API request failed');
	}
}
