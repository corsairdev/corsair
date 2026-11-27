import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { BinaryResponse, FileInput } from 'corsair/http';
import { resolveFileInput, toFileOutput } from 'corsair/http';
import type { GiteaRequest } from '../client';
import {
	encodeGiteaPathValue,
	GITEA_PAGE_SIZE,
	GITEA_UPLOAD_MAX_BYTES,
	makeGiteaRequest,
} from '../client';
import type { GiteaContext } from '../index';
import type { GiteaOperationDefinition } from './manifest';
import {
	getGiteaInputSchema,
	getGiteaOutputSchema,
	giteaInputFields,
	giteaOperationFor,
	giteaOutputIsList,
	MASKED_KEY,
	maskedIssuePath,
} from './openapi-schema';
import type {
	GiteaOperationId,
	GiteaOperationInputs,
	GiteaOperationOutputs,
} from './operation-types';

export type GiteaOperationEndpoint<Id extends GiteaOperationId> =
	CorsairEndpoint<
		GiteaContext,
		GiteaOperationInputs[Id],
		GiteaOperationOutputs[Id]
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
										giteaInputFields(id)
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

/** Body fields that hold a file (`attachment` on the upload routes). */
export function fileFields(operation: GiteaOperationDefinition): Set<string> {
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
	operation: GiteaOperationDefinition,
	// `unknown` because the body fields are validated per operation.
	body: Record<string, unknown>,
): Promise<FormData> {
	const files = fileFields(operation);
	const form = new FormData();
	for (const [name, value] of Object.entries(body)) {
		if (value === undefined || value === null) continue;
		if (files.has(name) && (isFileValue(value) || typeof value === 'string')) {
			const resolved = await resolveFileInput(value as FileInput, {
				maxBytes: GITEA_UPLOAD_MAX_BYTES,
				fallbackName: 'attachment',
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

/** File extensions for the content types Gitea's downloads come back as. */
const EXTENSIONS: Record<string, string> = {
	'application/zip': 'zip',
	'application/gzip': 'tar.gz',
	'application/x-gzip': 'tar.gz',
	'application/x-bundle': 'bundle',
	'text/plain': 'txt',
	'application/pdf': 'pdf',
	'image/png': 'png',
	'image/jpeg': 'jpg',
};

/**
 * What to call a downloaded file: the last segment of the path value it was
 * asked for (`docs/a.md` → `a.md`, `main.zip`), else the operation and the
 * record id with the content type's extension
 * (`gitea-actions-artifacts-download-12.zip`).
 */
// `unknown` because each operation's validated input has its own fields.
export function fileNameFor(
	id: string,
	input: Record<string, unknown>,
	contentType?: string | null,
): string {
	for (const key of ['filepath', 'archive']) {
		const value = input[key];
		if (typeof value === 'string') {
			const last = value
				.split('/')
				.pop()
				?.replace(/[^\w.-]/g, '_');
			if (last && last !== '.' && last !== '..') return last;
		}
	}
	const what = id
		.replace(/\./g, '-')
		.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
	const record = input.artifact_id ?? input.job_id ?? input.run;
	const ref =
		typeof record === 'string' || typeof record === 'number'
			? `-${String(record).replace(/[^0-9A-Za-z_-]/g, '')}`
			: '';
	const type = (contentType ?? '').split(';')[0]?.trim().toLowerCase() ?? '';
	const extension = EXTENSIONS[type];
	return `gitea-${what}${ref}${extension ? `.${extension}` : ''}`;
}

// `unknown` because the value is a validated number.
function positiveInteger(value: unknown): number | undefined {
	return typeof value === 'number' && Number.isInteger(value) && value > 0
		? value
		: undefined;
}

/**
 * The page to ask for next. Gitea's next page is in a Link header core
 * doesn't return, and a short page doesn't prove the list ended: Gitea
 * clamps `limit` to MAX_RESPONSE_ITEMS, which an admin can set below what
 * was asked (and change at any time). So any page with entries may have a
 * next one, and an empty page is the last.
 */
// `unknown` because the input was validated against an open schema.
export function nextPageOf(
	input: Record<string, unknown>,
	count: number,
): number | null {
	return count > 0 ? (positiveInteger(input.page) ?? 1) + 1 : null;
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
		throw new Error(`Gitea ${id} answered with a body that is not JSON`);
	}
}

/**
 * A download's body is usable when it isn't empty or an HTML page (a login
 * page, a proxy error) the caller didn't ask for. A raw file can be HTML
 * itself, so those two routes only refuse an empty body.
 */
export function isUsableFile(
	id: string,
	bytes: Uint8Array,
	contentType: string | null | undefined,
): boolean {
	if (bytes.byteLength === 0) {
		// An empty file in the repository is still a file.
		return id === 'contents.raw' || id === 'contents.media';
	}
	if (id === 'contents.raw' || id === 'contents.media') return true;
	if ((contentType ?? '').toLowerCase().includes('html')) return false;
	const head = new TextDecoder()
		.decode(bytes.subarray(0, 1024))
		.replace(/^[\s﻿]+/, '');
	return !/^<(!doctype html|html)/i.test(head);
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
export function createGiteaOperation<Id extends GiteaOperationId>(
	id: Id,
): GiteaOperationEndpoint<Id> {
	return async (ctx, input) => {
		const operation = giteaOperationFor(id);
		const parsedInput = getGiteaInputSchema(id).safeParse(input ?? {});
		if (!parsedInput.success) {
			// Paths and messages only: zod's messages name what was expected, not the value sent.
			throw new Error(
				`Invalid input for gitea ${id}: ${describeIssues(id, parsedInput.error.issues, 'input', 5)}`,
			);
		}
		// Send what was validated, not the caller's object.
		// `unknown` is necessary because the fields differ per operation; each was just validated.
		const valid: Record<string, unknown> = { ...parsedInput.data };

		const pathParameters: Record<string, string> = {};
		// `unknown` because query values are validated scalars or lists.
		const query: Record<string, unknown> = {};
		// `unknown` because body values are validated per operation.
		const body: Record<string, unknown> = {};
		const named = new Set<string>();
		for (const field of giteaInputFields(id)) {
			named.add(field.name);
			const value = valid[field.name];
			if (value === undefined || value === null) continue;
			switch (field.in) {
				case 'path':
					pathParameters[field.wire] = encodeGiteaPathValue(
						String(value),
						field.slashes,
					);
					break;
				case 'query':
					// A list goes out as repeated keys (`labels=1&labels=2`), the
					// swagger's collectionFormat `multi`.
					query[field.wire] = value;
					break;
				default:
					body[field.wire] = value;
			}
		}
		// Keys the schema let through (objects keep unknown keys) go in the body.
		for (const [name, value] of Object.entries(valid)) {
			if (!named.has(name) && value !== undefined) body[name] = value;
		}
		if (
			operation.paginated &&
			!operation.unsizedPages &&
			query.limit === undefined
		) {
			// Gitea's default page size (30) is below its default cap (50).
			query.limit = GITEA_PAGE_SIZE;
		}

		const request: GiteaRequest = {
			method: operation.method,
			path: operation.path,
			pathParameters,
			query,
			// A route that may answer with no body is read as bytes: core turns
			// both an empty body and JSON it can't decode into `undefined`, and
			// only the second is an error.
			...(operation.emptyOk || operation.response === 'empty'
				? { responseType: 'binary' as const }
				: {}),
			...(operation.timeoutMs ? { timeoutMs: operation.timeoutMs } : {}),
		};
		// Fields Gitea sets itself never go back, even when the caller passes an object it read.
		for (const name of operation.serverSetFields ?? []) delete body[name];
		if (operation.request === 'json') request.body = body;
		else if (operation.request === 'multipart') {
			request.body = await buildForm(operation, body);
		} else if (operation.request === 'text') {
			request.body = String(body.text ?? '');
			request.bodyMediaType = 'text/plain';
		}

		// `unknown` because the response is untrusted until the output schema parses it.
		let response: unknown;
		if (operation.response === 'file') {
			request.responseType = 'binary';
			const binary = await makeGiteaRequest(ctx, request);
			if (!isBinaryResponse(binary)) throw new Error('Gitea returned no file');
			// An empty body or an HTML page (a proxy, a login redirect) is an
			// error, not a file.
			if (!isUsableFile(id, binary.bytes, binary.contentType)) {
				throw new Error(`Gitea ${id} answered without a file`);
			}
			response = toFileOutput(binary.bytes, binary.contentType, {
				filename: fileNameFor(id, parsedInput.data, binary.contentType),
			});
		} else if (operation.response === 'text') {
			request.responseType = 'binary';
			const binary = await makeGiteaRequest(ctx, request);
			if (!isBinaryResponse(binary)) throw new Error('Gitea returned no body');
			response = { text: new TextDecoder().decode(binary.bytes) };
		} else if (operation.response === 'empty') {
			// The spec documents no body, so the 2xx status is the answer. A body
			// is still read: JSON (Gitea answering anyway) is fine, but bytes that
			// aren't JSON point at something other than Gitea (a proxy page) and
			// throw instead of counting as a success.
			decodeMaybeEmpty(id, await makeGiteaRequest(ctx, request));
			response = { success: true };
		} else {
			let raw = await makeGiteaRequest(ctx, request);
			if (operation.emptyOk) raw = decodeMaybeEmpty(id, raw);
			// Go writes an empty list it never filled as `null` (issue templates
			// on a repository without any, live 11-27): the same empty list.
			if (raw === null && giteaOutputIsList(id)) raw = [];
			if (raw === EMPTY) {
				response = { success: true };
			} else if (operation.paginated && Array.isArray(raw)) {
				response = {
					items: raw,
					next_page: nextPageOf(parsedInput.data, raw.length),
				};
			} else {
				response = raw;
			}
		}

		// The output schema is built from the documented response; a body that
		// doesn't match it is an error, never replaced with a default.
		const parsedOutput = getGiteaOutputSchema(id).safeParse(response);
		if (!parsedOutput.success) {
			throw new Error(
				`Gitea ${id} response did not match its documented schema: ${describeIssues(id, parsedOutput.error.issues, 'output', 3)}`,
			);
		}

		// Inputs and results hold code, issue text, secrets and user data: log
		// only which operation ran.
		await logEventFromContext(
			ctx,
			'gitea.operation',
			{ operationId: id },
			'completed',
		);
		return parsedOutput.data as GiteaOperationOutputs[Id];
	};
}
