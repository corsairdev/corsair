import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import {
	makePipedriveBinaryRequest,
	makePipedriveRequest,
	withOAuthRetry,
} from '../client';
import type { PipedriveContext } from '../index';

type QueryPrimitive = string | number | boolean;
type QueryValue = QueryPrimitive | QueryPrimitive[];

type QueryParameter = {
	name: string;
	style: string;
	explode: boolean;
	type: string;
};

type CatalogOperation<I extends z.ZodType, O extends z.ZodType> = {
	version: 'v1' | 'v2';
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	path: string;
	requestContentType: string;
	isBinary: boolean;
	queryParams: readonly QueryParameter[];
	headerParams: readonly string[];
	input: I;
	output: O;
};

// `unknown` is necessary because OpenAPI-generated parsed objects are accessed by route metadata.
function toRecord(value: unknown): Record<string, unknown> {
	if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
		return Object.fromEntries(Object.entries(value));
	}
	return {};
}

// `unknown` is necessary because query values are selected by generated parameter names.
function toPrimitive(value: unknown): QueryPrimitive | undefined {
	if (
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean'
	) {
		return value;
	}
	return undefined;
}

// `unknown` is necessary because parameter values are read from a generated schema map.
function queryValue(
	query: Record<string, QueryValue>,
	name: string,
	// `unknown` is necessary because parameter values are selected by runtime metadata.
	value: unknown,
	parameter: QueryParameter,
): void {
	if (Array.isArray(value)) {
		const values = value
			.map((entry) => toPrimitive(entry))
			.filter((entry) => entry !== undefined);
		if (parameter.explode) {
			query[name] = values;
		} else {
			const delimiter =
				parameter.style === 'pipeDelimited'
					? '|'
					: parameter.style === 'spaceDelimited'
						? ' '
						: ',';
			query[name] = values.map(String).join(delimiter);
		}
		return;
	}
	if (value !== null && typeof value === 'object') {
		const entries = Object.entries(toRecord(value)).flatMap(([key, entry]) => {
			const primitive = toPrimitive(entry);
			return primitive === undefined ? [] : [[key, primitive] as const];
		});
		if (parameter.style === 'deepObject') {
			for (const [key, entry] of entries) query[`${name}[${key}]`] = entry;
		} else if (parameter.explode) {
			for (const [key, entry] of entries) query[key] = entry;
		} else {
			query[name] = entries
				.flatMap(([key, entry]) => [key, String(entry)])
				.join(',');
		}
		return;
	}
	const primitive = toPrimitive(value);
	if (primitive !== undefined) query[name] = primitive;
}

// `unknown` is necessary because OpenAPI query parameter names are discovered at runtime.
function makeQuery(
	parameters: readonly QueryParameter[],
	values: Record<string, unknown>,
): Record<string, QueryValue> {
	const query: Record<string, QueryValue> = {};
	for (const parameter of parameters) {
		if (Object.hasOwn(values, parameter.name)) {
			queryValue(query, parameter.name, values[parameter.name], parameter);
		}
	}
	return query;
}

// `unknown` is necessary because multipart bodies are defined by their OpenAPI schema.
function formDataFrom(value: unknown): FormData {
	const formData = new FormData();
	const append = (key: string, entry: unknown) => {
		// `unknown` is necessary because OpenAPI permits scalar, array, object, and Blob form fields.
		if (entry === undefined) return;
		if (entry === null) {
			formData.append(key, '');
			return;
		}
		if (Array.isArray(entry)) {
			for (const item of entry) append(key, item);
			return;
		}
		if (entry instanceof Blob) {
			formData.append(key, entry);
			return;
		}
		if (
			typeof entry === 'string' ||
			typeof entry === 'number' ||
			typeof entry === 'boolean'
		) {
			formData.append(key, String(entry));
			return;
		}
		formData.append(key, JSON.stringify(entry));
	};
	for (const [key, entry] of Object.entries(toRecord(value)))
		append(key, entry);
	return formData;
}

// `unknown` is necessary because form-encoded request bodies are schema-driven.
function urlEncodedBody(value: unknown): string {
	const search = new URLSearchParams();
	const append = (key: string, entry: unknown) => {
		// `unknown` is necessary because form-encoded values may be scalars, arrays, or objects.
		if (entry === undefined) return;
		if (entry === null) {
			search.append(key, '');
			return;
		}
		if (Array.isArray(entry)) {
			for (const item of entry) append(key, item);
			return;
		}
		if (typeof entry === 'object') {
			for (const [childKey, childValue] of Object.entries(toRecord(entry))) {
				append(childKey, childValue);
			}
			return;
		}
		search.append(key, String(entry));
	};
	for (const [key, entry] of Object.entries(toRecord(value)))
		append(key, entry);
	return search.toString();
}

// `unknown` is necessary because OpenAPI header parameter names are discovered at runtime.
// `unknown` is necessary because header values are read from OpenAPI-generated input schemas.
function requestHeaders(
	parameters: readonly string[],
	values: Record<string, unknown>,
): Record<string, string> {
	const headers: Record<string, string> = {};
	for (const name of parameters) {
		const value = values[name];
		if (typeof value === 'string') headers[name] = value;
	}
	return headers;
}

export function createPipedriveCatalogEndpoint<
	K extends string,
	I extends z.ZodType,
	O extends z.ZodType,
>(
	key: K,
	route: CatalogOperation<I, O>,
): (ctx: PipedriveContext, input: z.input<I>) => Promise<z.output<O>> {
	const endpoint = async (
		ctx: PipedriveContext,
		input: z.input<I>,
	): Promise<z.output<O>> => {
		const parsedInput = route.input.parse(input);
		const inputValues = toRecord(parsedInput);
		const pathValues = toRecord(inputValues.path);
		const queryValues = toRecord(inputValues.query);
		const headerValues = toRecord(inputValues.headers);
		const path = route.path.replace(/\{([^}]+)\}/g, (_match, name: string) => {
			const value = pathValues[name];
			if (typeof value !== 'string' && typeof value !== 'number') {
				throw new Error(`Missing Pipedrive path parameter: ${name}`);
			}
			return encodeURIComponent(String(value));
		});
		const query = makeQuery(route.queryParams, queryValues);
		const headers = requestHeaders(route.headerParams, headerValues);
		const requestBody = inputValues.body;
		// `unknown` is necessary because transport responses stay untrusted until the output schema parses them.
		let response: unknown;
		if (route.isBinary) {
			if (route.method !== 'GET') {
				throw new Error('Pipedrive binary responses must use GET');
			}
			response = await makePipedriveBinaryRequest(
				path,
				ctx.key,
				ctx.options.authType === 'oauth_2' ? 'oauth_2' : 'api_key',
				{ method: route.method, query, headers, apiVersion: route.version },
			);
		} else {
			const contentType = route.requestContentType;
			const body =
				contentType === 'multipart/form-data'
					? formDataFrom(requestBody)
					: contentType === 'application/x-www-form-urlencoded'
						? urlEncodedBody(requestBody)
						: requestBody;
			response = await makePipedriveRequest(
				path,
				ctx.key,
				ctx.options.authType === 'oauth_2' ? 'oauth_2' : 'api_key',
				{
					method: route.method,
					query,
					body,
					headers,
					apiVersion: route.version,
					contentType: contentType || undefined,
				},
			);
		}
		const parsedOutput = route.output.parse(response);
		await logEventFromContext(ctx, `pipedrive.${key}`, {}, 'completed');
		return parsedOutput;
	};
	return route.method === 'GET' ? endpoint : withOAuthRetry(endpoint);
}
