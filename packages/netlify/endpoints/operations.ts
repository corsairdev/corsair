import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { BinaryResponse, FileInput } from 'corsair/http';
import { resolveFileInput } from 'corsair/http';
import type { NetlifyRequest } from '../client';
import {
	encodeNetlifyPathValue,
	makeNetlifyRequest,
	NETLIFY_PAGE_SIZE,
	NETLIFY_UPLOAD_MAX_BYTES,
	NETLIFY_UPLOAD_TIMEOUT_MS,
} from '../client';
import type { NetlifyContext } from '../index';
import type { NetlifyOperationDefinition } from './manifest';
import {
	getNetlifyInputSchema,
	getNetlifyOutputSchema,
	MASKED_KEY,
	maskedIssuePath,
	netlifyInputFields,
	netlifyOperationFor,
} from './openapi-schema';
import type {
	NetlifyOperationId,
	NetlifyOperationInputs,
	NetlifyOperationOutputs,
} from './operation-types';

export type NetlifyOperationEndpoint<Id extends NetlifyOperationId> =
	CorsairEndpoint<
		NetlifyContext,
		NetlifyOperationInputs[Id],
		NetlifyOperationOutputs[Id]
	>;

type Issue = {
	path: readonly PropertyKey[];
	message: string;
	code?: string;
	keys?: readonly string[];
};

/**
 * Issue paths and zod's messages, which name what was expected rather than the
 * value sent. Map keys are masked, and so is every unknown key the caller
 * sent; the message lists the fields the operation takes instead.
 */
export function describeIssues(
	id: string,
	issues: readonly Issue[],
	mode: 'input' | 'output',
	limit: number,
): string {
	return issues
		.slice(0, limit)
		.map((issue) => {
			const where =
				maskedIssuePath(id, issue.path, mode) ||
				(mode === 'input' ? 'input' : 'response');
			const unknown = issue.keys?.length ?? 0;
			const message =
				issue.code === 'unrecognized_keys'
					? `${unknown} unknown field${unknown === 1 ? '' : 's'} (${Array(
							unknown,
						)
							.fill(MASKED_KEY)
							.join(', ')})${
							issue.path.length === 0 && mode === 'input'
								? `; this operation takes ${
										netlifyInputFields(id)
											.map((field) => field.name)
											.join(', ') || 'no fields'
									}`
								: ''
						}`
					: issue.message;
			return `${where}: ${message}`;
		})
		.join('; ');
}

// `unknown` because a form value is a validated scalar or file.
function isFileValue(value: unknown): value is FileInput | Blob {
	if (typeof Blob !== 'undefined' && value instanceof Blob) return true;
	if (typeof value === 'string') return false;
	return (
		typeof value === 'object' &&
		value !== null &&
		!Array.isArray(value) &&
		('base64' in value || 'url' in value)
	);
}

/** Form fields that hold a file (`zip` on sites.builds.create). */
export function fileFields(operation: NetlifyOperationDefinition): Set<string> {
	const names = new Set<string>();
	const properties = operation.input.properties;
	if (typeof properties !== 'object' || properties === null) return names;
	for (const [name, schema] of Object.entries(properties)) {
		if (
			typeof schema === 'object' &&
			schema !== null &&
			// `unknown` because a property schema is raw provider JSON Schema.
			(schema as Record<string, unknown>).format === 'binary'
		) {
			names.add(name);
		}
	}
	return names;
}

/**
 * The multipart form for an upload route. Each file field is turned into bytes
 * with core's `resolveFileInput` (a public URL is downloaded, base64 is
 * decoded) before the form is built; a bare string in a file field is a URL.
 */
async function buildForm(
	operation: NetlifyOperationDefinition,
	// `unknown` because the body fields are validated per operation.
	body: Record<string, unknown>,
): Promise<FormData> {
	const files = fileFields(operation);
	const form = new FormData();
	for (const [name, value] of Object.entries(body)) {
		if (value === undefined || value === null) continue;
		if (files.has(name) && (isFileValue(value) || typeof value === 'string')) {
			const resolved = await resolveFileInput(value as FileInput, {
				maxBytes: NETLIFY_UPLOAD_MAX_BYTES,
				fallbackName: 'site.zip',
			});
			form.append(name, resolved.file, resolved.filename);
		} else {
			form.append(
				name,
				typeof value === 'object' ? JSON.stringify(value) : String(value),
			);
		}
	}
	return form;
}

// `unknown` because the value is a validated number.
function positiveInteger(value: unknown): number | undefined {
	return typeof value === 'number' && Number.isInteger(value) && value > 0
		? value
		: undefined;
}

/**
 * The page to ask for next. Netlify's next page is in a Link header core
 * doesn't return, so a page that came back with `per_page` entries (the
 * plugin sends 100 when the caller leaves it out) is taken to have a next
 * one; a shorter page is the last. A list Netlify sizes itself (no
 * `per_page`) may have a next page while a page has entries.
 */
// `unknown` because the input was validated against an open schema.
export function nextPageOf(
	input: Record<string, unknown>,
	count: number,
	sized: boolean,
): number | null {
	const page = positiveInteger(input.page) ?? 1;
	if (!sized) return count > 0 ? page + 1 : null;
	const perPage = positiveInteger(input.per_page) ?? NETLIFY_PAGE_SIZE;
	return count >= perPage ? page + 1 : null;
}

/** Marks a 2xx that came back without a body. */
const EMPTY = Symbol('empty');

/**
 * The body of a route the spec documents as JSON or no body at all, read as
 * bytes: nothing (or whitespace) is a bodiless success, anything else must
 * be JSON. A body that isn't is an error, never a made-up success.
 */
// `unknown` because the value came from core's binary transport and is parsed by the output schema next.
export function decodeMaybeEmpty(id: string, value: unknown): unknown {
	if (!isBinaryResponse(value)) return value;
	const text = new TextDecoder().decode(value.bytes);
	if (text.trim().length === 0) return EMPTY;
	try {
		return JSON.parse(text);
	} catch {
		// The body itself stays out of the message: it can hold private data.
		throw new Error(`Netlify ${id} answered with a body that is not JSON`);
	}
}

// `unknown` because the value came from core's binary transport.
function isBinaryResponse(value: unknown): value is BinaryResponse {
	return (
		typeof value === 'object' &&
		value !== null &&
		'bytes' in value &&
		value.bytes instanceof Uint8Array
	);
}

/**
 * One endpoint per manifest operation. The caller passes one flat object;
 * each named field goes to the path or query string as the spec says, and
 * everything else is the request body.
 */
export function createNetlifyOperation<Id extends NetlifyOperationId>(
	id: Id,
): NetlifyOperationEndpoint<Id> {
	return async (ctx, input) => {
		const operation = netlifyOperationFor(id);
		const parsedInput = getNetlifyInputSchema(id).safeParse(input ?? {});
		if (!parsedInput.success) {
			// Paths and messages only: zod's messages name what was expected, not the value sent.
			throw new Error(
				`Invalid input for netlify ${id}: ${describeIssues(id, parsedInput.error.issues, 'input', 5)}`,
			);
		}
		// Send what was validated, not the caller's object.
		// `unknown` is necessary because the fields differ per operation; each was just validated.
		const valid: Record<string, unknown> = { ...parsedInput.data };

		const pathParameters: Record<string, string> = {};
		// `unknown` because query values are validated scalars or lists.
		const query: Record<string, unknown> = {};
		const headers: Record<string, string> = {};
		// `unknown` because body values are validated per operation.
		const body: Record<string, unknown> = {};
		// `unknown` because a whole-body value is a list, an object or an upload.
		let bodyRoot: unknown;
		// `unknown` because a zip is a validated file input.
		let zipBody: unknown;
		const named = new Set<string>();
		for (const field of netlifyInputFields(id)) {
			named.add(field.name);
			const value = valid[field.name];
			if (value === undefined || value === null) continue;
			switch (field.in) {
				case 'path':
					pathParameters[field.wire] = encodeNetlifyPathValue(
						String(value),
						field.slashes,
					);
					break;
				case 'query':
					// A list goes out as repeated keys, the swagger's collectionFormat `multi`.
					query[field.wire] = value;
					break;
				case 'header':
					headers[field.wire] = String(value);
					break;
				case 'bodyRoot':
					bodyRoot = value;
					break;
				case 'zipBody':
					zipBody = value;
					break;
				default:
					body[field.wire] = value;
			}
			if (field.alsoBody) body[field.wire] = value;
		}
		// Keys the schema let through (objects keep unknown keys) go in the body.
		for (const [name, value] of Object.entries(valid)) {
			if (!named.has(name) && value !== undefined) body[name] = value;
		}
		if (
			operation.paginated &&
			!operation.unsizedPages &&
			query.per_page === undefined
		) {
			query.per_page = NETLIFY_PAGE_SIZE;
		}

		const request: NetlifyRequest = {
			method: operation.method,
			path: operation.path,
			pathParameters,
			query,
			headers,
			// A route that may answer with no body is read as bytes: core turns
			// both an empty body and JSON it can't decode into `undefined`, and
			// only the second is an error.
			...(operation.emptyOk || operation.response === 'empty'
				? { responseType: 'binary' as const }
				: {}),
			...(operation.timeoutMs ? { timeoutMs: operation.timeoutMs } : {}),
		};
		// Fields Netlify sets itself never go back, even when the caller passes an object it read.
		for (const name of operation.serverSetFields ?? []) delete body[name];
		if (zipBody !== undefined) {
			// A zip deploy: the archive is the whole body (application/zip),
			// the documented alternative to a JSON file digest.
			const resolved = await resolveFileInput(zipBody as FileInput, {
				maxBytes: NETLIFY_UPLOAD_MAX_BYTES,
				fallbackName: 'site.zip',
			});
			request.body = new Blob([resolved.file], { type: 'application/zip' });
			request.timeoutMs = operation.timeoutMs ?? NETLIFY_UPLOAD_TIMEOUT_MS;
		} else if (operation.request === 'json') {
			request.body =
				bodyRoot !== undefined
					? (bodyRoot as Record<string, unknown> | unknown[])
					: body;
		} else if (operation.request === 'multipart') {
			request.body = await buildForm(operation, body);
		} else if (operation.request === 'binary') {
			// The upload's bytes are the whole body (application/octet-stream).
			const resolved = await resolveFileInput(bodyRoot as FileInput, {
				maxBytes: NETLIFY_UPLOAD_MAX_BYTES,
				fallbackName: 'file',
			});
			request.body = new Blob([resolved.file], {
				type: 'application/octet-stream',
			});
			request.timeoutMs = operation.timeoutMs ?? NETLIFY_UPLOAD_TIMEOUT_MS;
		}

		// `unknown` because the response is untrusted until the output schema parses it.
		let response: unknown;
		if (operation.response === 'text') {
			request.responseType = 'binary';
			const binary = await makeNetlifyRequest(ctx, request);
			if (!isBinaryResponse(binary))
				throw new Error('Netlify returned no body');
			response = { text: new TextDecoder().decode(binary.bytes) };
		} else if (operation.response === 'empty') {
			// The spec documents no body, so the 2xx status is the answer. A body
			// is still read: JSON (Netlify answering anyway) is fine, but bytes that
			// aren't JSON point at something other than Netlify (a proxy page) and
			// throw instead of counting as a success.
			decodeMaybeEmpty(id, await makeNetlifyRequest(ctx, request));
			response = { success: true };
		} else {
			let raw = await makeNetlifyRequest(ctx, request);
			if (operation.emptyOk) raw = decodeMaybeEmpty(id, raw);
			// Core resolves a 2xx whose JSON it can't decode (or an empty body)
			// as `undefined`: that is a failure, never a result.
			else if (raw === undefined) {
				throw new Error(`Netlify ${id} returned no decodable JSON body`);
			}
			if (raw === EMPTY) {
				response = { success: true };
			} else if (operation.paginated && Array.isArray(raw)) {
				response = {
					items: raw,
					next_page: nextPageOf(
						parsedInput.data,
						raw.length,
						!operation.unsizedPages,
					),
				};
			} else {
				response = raw;
			}
		}

		// The output schema is built from the documented response; a body that
		// doesn't match it is an error, never replaced with a default.
		const parsedOutput = getNetlifyOutputSchema(id).safeParse(response);
		if (!parsedOutput.success) {
			throw new Error(
				`Netlify ${id} response did not match its documented schema: ${describeIssues(id, parsedOutput.error.issues, 'output', 3)}`,
			);
		}

		// Inputs and results hold environment values, site files, form
		// submissions and member emails: log only which operation ran.
		await logEventFromContext(
			ctx,
			'netlify.operation',
			{ operationId: id },
			'completed',
		);
		return parsedOutput.data as NetlifyOperationOutputs[Id];
	};
}
