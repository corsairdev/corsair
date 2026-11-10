import type { ZenRowsEndpoints } from '..';
import type { ZenrowsResponse } from '../client';
import { parseJsonBody } from '../client';
import { call } from './call';
import {
	ZenRowsEndpointInputSchemas as Inputs,
	ZenRowsEndpointOutputSchemas as Outputs,
} from './types';

/**
 * A Fetch request's wire query. Zenrows names parameters in snake_case and
 * takes booleans as `true`/`false`, comma-joins a list, and JSON-encodes the
 * selector and instruction objects.
 *
 * `customHeaders` decides where the key travels: with it on, Zenrows copies
 * every header on the API request onto the target request, so the key moves to
 * the `apikey` query parameter, which Zenrows strips before forwarding.
 */
type FetchQueryInput = {
	mode?: 'auto';
	jsRender?: boolean;
	// unknown: each instruction is validated by the input schema; here they are
	// only re-serialised as JSON for the query string.
	jsInstructions?: readonly unknown[];
	customHeaders?: boolean;
	premiumProxy?: boolean;
	proxyCountry?: string;
	sessionId?: number;
	originalStatus?: boolean;
	allowedStatusCodes?: number[];
	waitFor?: string;
	wait?: number;
	blockResources?: readonly string[];
	responseType?: string;
	extract?: string;
	extractFields?: string[];
	cssExtractor?: Record<string, string>;
	outputs?: readonly string[];
};

function list(
	values: readonly (string | number)[] | undefined,
): string | undefined {
	return values && values.length > 0 ? values.join(',') : undefined;
}

/** The shared Fetch query. Undefined values are dropped by the client. */
export function fetchQuery(
	input: FetchQueryInput & { url: string },
): Record<string, string | number | boolean | undefined> {
	return {
		url: input.url,
		mode: input.mode,
		js_render: input.jsRender,
		js_instructions:
			input.jsInstructions === undefined
				? undefined
				: JSON.stringify(input.jsInstructions),
		custom_headers: input.customHeaders,
		premium_proxy: input.premiumProxy,
		proxy_country: input.proxyCountry,
		session_id: input.sessionId,
		original_status: input.originalStatus,
		allowed_status_codes: list(input.allowedStatusCodes),
		wait_for: input.waitFor,
		wait: input.wait,
		block_resources: list(input.blockResources),
		response_type: input.responseType,
		extract: input.extract,
		extract_fields: list(input.extractFields),
		css_extractor:
			input.cssExtractor === undefined
				? undefined
				: JSON.stringify(input.cssExtractor),
		outputs: list(input.outputs),
	};
}

/** `custom_headers` decides where the key goes, for every Fetch operation. */
export function fetchAuth(input: {
	customHeaders?: boolean;
}): 'header' | 'query' {
	return input.customHeaders === true ? 'query' : 'header';
}

/**
 * Zenrows labels HTML, Markdown, plaintext and JSON all as `text/plain`, so the
 * asked-for mode decides what the body is, not the content type.
 */
export const fetchPage: ZenRowsEndpoints['fetchPage'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'fetch.page',
			input: Inputs.fetchPage,
			output: Outputs.fetchPage,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1/',
			query: fetchQuery(parsed),
			auth: fetchAuth(parsed),
		}),
		{
			shape: (raw, parsed) => ({
				body: raw.text,
				contentType: raw.contentType,
				responseType: parsed.responseType ?? 'html',
			}),
			log: (parsed, result) => ({
				responseType: result.responseType,
				bytes: result.body.length,
				jsRender: parsed.jsRender,
				premiumProxy: parsed.premiumProxy,
				mode: parsed.mode,
			}),
		},
	);

export const fetchExtract: ZenRowsEndpoints['fetchExtract'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'fetch.extract',
			input: Inputs.fetchExtract,
			output: Outputs.fetchExtract,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1/',
			query: fetchQuery({ ...parsed, extract: parsed.extract ?? 'auto' }),
			auth: fetchAuth(parsed),
		}),
		{
			shape: (raw) => parseJsonBody(raw, '/v1/'),
			log: (parsed) => ({
				extract: parsed.extract ?? 'auto',
				fields: parsed.extractFields?.length,
			}),
		},
	);

export const fetchCssExtract: ZenRowsEndpoints['fetchCssExtract'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'fetch.cssExtract',
			input: Inputs.fetchCssExtract,
			output: Outputs.fetchCssExtract,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1/',
			query: fetchQuery(parsed),
			auth: fetchAuth(parsed),
		}),
		{
			shape: (raw) => parseJsonBody(raw, '/v1/'),
			log: (parsed) => ({ selectors: Object.keys(parsed.cssExtractor).length }),
		},
	);

export const fetchOutputs: ZenRowsEndpoints['fetchOutputs'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'fetch.outputs',
			input: Inputs.fetchOutputs,
			output: Outputs.fetchOutputs,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1/',
			query: fetchQuery(parsed),
			auth: fetchAuth(parsed),
		}),
		{
			shape: (raw) => parseJsonBody(raw, '/v1/'),
			log: (parsed) => ({ filters: parsed.outputs.join(',') }),
		},
	);

export const fetchJsonResponse: ZenRowsEndpoints['fetchJsonResponse'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'fetch.jsonResponse',
			input: Inputs.fetchJsonResponse,
			output: Outputs.fetchJsonResponse,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1/',
			query: { ...fetchQuery(parsed), json_response: true },
			auth: fetchAuth(parsed),
		}),
		{
			shape: (raw) => parseJsonBody(raw, '/v1/'),
			log: (parsed, result) => ({
				xhr: result.xhr?.length,
				selectors:
					parsed.cssExtractor === undefined
						? undefined
						: Object.keys(parsed.cssExtractor).length,
				filters: parsed.outputs?.join(','),
			}),
		},
	);

/**
 * The body is relayed as the target should receive it: a JSON object or array,
 * urlencoded fields, or a verbatim string with its own content type.
 * `corsair/http` only serialises an object when the media type is JSON, so the
 * form body is built here as a urlencoded string.
 */
function forwardedBody(parsed: {
	// unknown: the input schema has already validated the body's shape.
	body?:
		| { type: 'json'; value: Record<string, unknown> | unknown[] }
		| { type: 'form'; value: Record<string, string> }
		| { type: 'text'; value: string; contentType: string };
	// unknown: corsair/http takes a JSON-serialisable value or a string here.
}): { body: unknown; mediaType: string } | undefined {
	const body = parsed.body;
	if (!body) return undefined;
	switch (body.type) {
		case 'json':
			return { body: body.value, mediaType: 'application/json' };
		case 'form':
			return {
				body: new URLSearchParams(body.value).toString(),
				mediaType: 'application/x-www-form-urlencoded',
			};
		case 'text':
			return { body: body.value, mediaType: body.contentType };
	}
}

/**
 * A POST or PUT answer is the target's own page, and Zenrows labels every one
 * of these `text/plain` whatever the target's real type was (checked live
 * against a JSON target, which also arrived as text/plain). The body is
 * returned verbatim so nothing is claimed about it that has not been parsed.
 */
// unknown: the answer is the target's own page, in whatever type it serves.
function forwardedShape(raw: ZenrowsResponse): unknown {
	return { responseType: 'text', body: raw.text, contentType: raw.contentType };
}

export const fetchPost: ZenRowsEndpoints['fetchPost'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'fetch.post',
			input: Inputs.fetchPost,
			output: Outputs.fetchPost,
		},
		input,
		(parsed) => {
			const forwarded = forwardedBody(parsed);
			return {
				method: 'POST',
				path: '/v1/',
				query: fetchQuery(parsed),
				auth: fetchAuth(parsed),
				body: forwarded?.body,
				mediaType: forwarded?.mediaType,
			};
		},
		{
			shape: (raw) => forwardedShape(raw),
			log: (parsed) => ({
				bodyType: parsed.body?.type,
				jsRender: parsed.jsRender,
				premiumProxy: parsed.premiumProxy,
			}),
		},
	);

export const fetchPut: ZenRowsEndpoints['fetchPut'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'fetch.put',
			input: Inputs.fetchPut,
			output: Outputs.fetchPut,
		},
		input,
		(parsed) => {
			const forwarded = forwardedBody(parsed);
			return {
				method: 'PUT',
				path: '/v1/',
				query: fetchQuery(parsed),
				auth: fetchAuth(parsed),
				body: forwarded?.body,
				mediaType: forwarded?.mediaType,
			};
		},
		{
			shape: (raw) => forwardedShape(raw),
			log: (parsed) => ({
				bodyType: parsed.body?.type,
				jsRender: parsed.jsRender,
				premiumProxy: parsed.premiumProxy,
			}),
		},
	);
