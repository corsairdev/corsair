import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { BinaryResponse, FileInput } from 'corsair/http';
import { resolveFileInput, toFileOutput } from 'corsair/http';
import type { MaritimeRequest } from '../client';
import { MARITIME_UPLOAD_MAX_BYTES, makeMaritimeRequest } from '../client';
import type { MaritimeContext } from '../index';
import type { MaritimeOperationDefinition } from './manifest';
import {
	getMaritimeInputSchema,
	getMaritimeOutputSchema,
	MASKED_KEY,
	maritimeInputFields,
	maritimeOperationFor,
	maskedIssuePath,
} from './openapi-schema';
import type {
	MaritimeOperationId,
	MaritimeOperationInputs,
	MaritimeOperationOutputs,
} from './operation-types';

export type MaritimeOperationEndpoint<Id extends MaritimeOperationId> =
	CorsairEndpoint<
		MaritimeContext,
		MaritimeOperationInputs[Id],
		MaritimeOperationOutputs[Id]
	>;

type Issue = {
	path: readonly PropertyKey[];
	message: string;
	code?: string;
	keys?: readonly string[];
};

/**
 * Issue paths and zod's messages, which name what was expected rather than the
 * value sent. Map keys (metadata keys, header names) are masked, and so is
 * every unknown key the caller sent; the message lists the fields the
 * operation takes instead.
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
										maritimeInputFields(id)
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

// `unknown` because a form value is a validated scalar, file, list or object.
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

/** Top-level body fields that hold a file (`file` on the attachment routes). */
export function fileFields(
	operation: MaritimeOperationDefinition,
): Set<string> {
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
	operation: MaritimeOperationDefinition,
	// `unknown` because the body fields are validated per operation.
	body: Record<string, unknown>,
): Promise<FormData> {
	const files = fileFields(operation);
	const form = new FormData();
	for (const [name, value] of Object.entries(body)) {
		if (value === undefined || value === null) continue;
		if (files.has(name) && (isFileValue(value) || typeof value === 'string')) {
			const resolved = await resolveFileInput(value as FileInput, {
				maxBytes: MARITIME_UPLOAD_MAX_BYTES,
				fallbackName: 'file',
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

/** File extensions for the content types Maritime's downloads come back as. */
const EXTENSIONS: Record<string, string> = {
	'application/pdf': 'pdf',
	'application/json': 'json',
	'application/zip': 'zip',
	'text/csv': 'csv',
	'text/plain': 'txt',
	'image/png': 'png',
	'image/jpeg': 'jpg',
};

/**
 * What to call a downloaded file: the last segment of its `path`
 * (`/data/report.pdf` → `report.pdf`), else the operation and the record id
 * with the content type's extension (`maritime-computers-screenshot-cmp_1.png`).
 */
// `unknown` because each operation's validated input has its own fields.
export function fileNameFor(
	id: string,
	input: Record<string, unknown>,
	contentType?: string | null,
): string {
	if (typeof input.path === 'string') {
		const last = input.path
			.split('/')
			.pop()
			?.replace(/[^\w.-]/g, '_');
		if (last && last !== '.' && last !== '..') return last;
	}
	const what = id
		.replace(/\./g, '-')
		.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
	const record = input.computer_id ?? input.agent_id ?? input.sandbox_id;
	const ref =
		typeof record === 'string' || typeof record === 'number'
			? `-${String(record).replace(/[^0-9A-Za-z_-]/g, '')}`
			: '';
	const type = (contentType ?? '').split(';')[0]?.trim().toLowerCase() ?? '';
	const extension = EXTENSIONS[type];
	return `maritime-${what}${ref}${extension ? `.${extension}` : ''}`;
}

/**
 * A map query field (`metadata` on sandboxes.list) goes out as
 * `metadata[key]=value`; a list repeats its key (`state=running&state=paused`).
 */
// `unknown` because query values are validated scalars, lists or maps.
export function queryEntries(
	name: string,
	value: unknown,
	deepObject: boolean,
): Record<string, unknown> {
	if (deepObject && typeof value === 'object' && value !== null) {
		// `unknown` because map values are validated strings.
		const entries: Record<string, unknown> = {};
		for (const [key, inner] of Object.entries(value)) {
			entries[`${name}[${key}]`] = inner;
		}
		return entries;
	}
	return { [name]: value };
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
		throw new Error(`Maritime ${id} answered with a body that is not JSON`);
	}
}

/**
 * A download's body is usable when it isn't an HTML page the caller didn't
 * ask for (a login page, a proxy error). A file read from a machine's disk can
 * be empty or HTML itself, so those routes take any bytes.
 */
const DISK_READS = new Set([
	'agents.files.download',
	'computers.files.read',
	'sandboxes.files.read',
]);

export function isUsableFile(
	id: string,
	bytes: Uint8Array,
	contentType: string | null | undefined,
): boolean {
	if (DISK_READS.has(id)) return true;
	if (bytes.byteLength === 0) return false;
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

/** The raw body of a file write: UTF-8 text, or base64 decoded to bytes. */
export function rawBodyOf(content: string, encoding: unknown): Blob {
	if (encoding === 'base64') {
		const compact = content.replace(/\s+/g, '');
		if (!/^[A-Za-z0-9+/]*={0,2}$/.test(compact) || compact.length % 4 === 1) {
			throw new Error('content is not valid base64');
		}
		const bytes = Uint8Array.from(Buffer.from(compact, 'base64'));
		if (bytes.byteLength > MARITIME_UPLOAD_MAX_BYTES) {
			throw new Error('content is larger than 100 MB');
		}
		return new Blob([bytes], { type: 'application/octet-stream' });
	}
	const bytes = new TextEncoder().encode(content);
	if (bytes.byteLength > MARITIME_UPLOAD_MAX_BYTES) {
		throw new Error('content is larger than 100 MB');
	}
	return new Blob([bytes], { type: 'application/octet-stream' });
}

/** What the data plane of a virtual machine needs: its URL and secret. */
// `unknown` because the sandbox body is untrusted JSON until narrowed here.
export function dataPlaneOf(sandbox: unknown): { url: string; secret: string } {
	const record =
		typeof sandbox === 'object' && sandbox !== null
			? // `unknown` because each field is narrowed below.
				(sandbox as Record<string, unknown>)
			: {};
	const url = record.dataPlaneUrl;
	const secret = record.secret;
	if (typeof url !== 'string' || url.length === 0) {
		throw new Error('Maritime sandbox has no data plane URL');
	}
	if (typeof secret !== 'string' || secret.length === 0) {
		// Null when the sandbox ended, or when the key may not use the data plane.
		throw new Error(
			'This sandbox has no data plane secret: it has ended, or this API key cannot use the data plane (use a key with the sandboxes scope).',
		);
	}
	return { url, secret };
}

/**
 * One endpoint per manifest operation. The caller passes one flat object;
 * each named field goes to the path, query string or a header as the spec
 * says, and everything else is the request body.
 */
export function createMaritimeOperation<Id extends MaritimeOperationId>(
	id: Id,
): MaritimeOperationEndpoint<Id> {
	return async (ctx, input) => {
		const operation = maritimeOperationFor(id);
		const parsedInput = getMaritimeInputSchema(id).safeParse(input ?? {});
		if (!parsedInput.success) {
			// Paths and messages only: zod's messages name what was expected, not the value sent.
			throw new Error(
				`Invalid input for maritime ${id}: ${describeIssues(id, parsedInput.error.issues, 'input', 5)}`,
			);
		}
		// Send what was validated, not the caller's object.
		// `unknown` is necessary because the fields differ per operation; each was just validated.
		const valid: Record<string, unknown> = { ...parsedInput.data };

		const pathParameters: Record<string, string> = {};
		// `unknown` because query values are validated scalars, lists or maps.
		const query: Record<string, unknown> = {};
		const headers: Record<string, string> = {};
		let sandbox: string | undefined;
		for (const field of maritimeInputFields(id)) {
			if (field.in === 'body') continue;
			let value = valid[field.name];
			delete valid[field.name];
			if ((value === undefined || value === null) && field.generated) {
				// A fresh Idempotency-Key per call, so core's retries of this one
				// call can't run it twice.
				value = globalThis.crypto.randomUUID();
			}
			if (value === undefined || value === null) continue;
			switch (field.in) {
				case 'path':
					pathParameters[field.name] = String(value);
					break;
				case 'header':
					headers[field.header ?? field.name] = String(value);
					break;
				case 'query':
					Object.assign(
						query,
						queryEntries(field.name, value, field.deepObject === true),
					);
					break;
				case 'sandbox':
					sandbox = String(value);
					break;
			}
		}

		const request: MaritimeRequest = {
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
		};
		const waitSeconds = operation.timeoutFromInput
			? valid[operation.timeoutFromInput]
			: undefined;
		if (valid.detached === true || valid.background === true) {
			// A detached command answers once it is accepted.
			request.timeoutMs = 90_000;
		} else if (typeof waitSeconds === 'number') {
			// An attached command can run up to its own timeout: wait that long
			// plus a margin before giving up on the answer.
			request.timeoutMs = (waitSeconds + 30) * 1000;
		} else if (operation.timeoutFromInput) {
			// Maritime's default limit is 60 seconds.
			request.timeoutMs = 90_000;
		}
		if (operation.plane === 'data') {
			if (!sandbox) throw new Error('sandbox_id is required');
			// The data plane takes the sandbox's own secret, read fresh each call
			// (it changes when the secret is rotated or a key revoked).
			request.dataPlane = dataPlaneOf(
				await makeMaritimeRequest(ctx, {
					method: 'GET',
					path: '/v1/sandboxes/{id_or_name}',
					pathParameters: { id_or_name: sandbox },
				}),
			);
		}
		if (operation.request === 'json') request.body = valid;
		else if (operation.request === 'multipart') {
			request.body = await buildForm(operation, valid);
		} else if (operation.request === 'raw') {
			request.body = rawBodyOf(String(valid.content ?? ''), valid.encoding);
		}

		// `unknown` because the response is untrusted until the output schema parses it.
		let response: unknown;
		if (operation.response === 'file') {
			request.responseType = 'binary';
			const binary = await makeMaritimeRequest(ctx, request);
			if (!isBinaryResponse(binary))
				throw new Error('Maritime returned no file');
			// An HTML page (a proxy, a login redirect) is an error, not a file.
			if (!isUsableFile(id, binary.bytes, binary.contentType)) {
				throw new Error(`Maritime ${id} answered without a file`);
			}
			response = toFileOutput(binary.bytes, binary.contentType, {
				filename: fileNameFor(id, parsedInput.data, binary.contentType),
			});
		} else if (operation.response === 'text') {
			request.responseType = 'binary';
			const binary = await makeMaritimeRequest(ctx, request);
			if (!isBinaryResponse(binary))
				throw new Error('Maritime returned no body');
			response = { text: new TextDecoder().decode(binary.bytes) };
		} else if (operation.response === 'empty') {
			// The spec documents no body, so the 2xx status is the answer. A body
			// is still read: JSON (Maritime answering anyway) is fine, but bytes that
			// aren't JSON point at something other than Maritime (a proxy page) and
			// throw instead of counting as a success.
			decodeMaybeEmpty(id, await makeMaritimeRequest(ctx, request));
			response = { success: true };
		} else {
			let body = await makeMaritimeRequest(ctx, request);
			if (operation.emptyOk) {
				body = decodeMaybeEmpty(id, body);
			} else if (body === undefined) {
				// Core answers `undefined` for an empty body and for JSON it
				// couldn't decode. This route documents a JSON body, so either
				// is an error, even where the documented schema is open.
				throw new Error(`Maritime ${id} answered without a JSON body`);
			}
			response = body === EMPTY ? { success: true } : body;
		}

		// The output schema is built from the documented response; a body that
		// doesn't match it is an error, never replaced with a default.
		const parsedOutput = getMaritimeOutputSchema(id).safeParse(response);
		if (!parsedOutput.success) {
			throw new Error(
				`Maritime ${id} response did not match its documented schema: ${describeIssues(id, parsedOutput.error.issues, 'output', 3)}`,
			);
		}

		// Inputs and results hold commands, files, chat messages and secrets:
		// log only which operation ran.
		await logEventFromContext(
			ctx,
			'maritime.operation',
			{ operationId: id },
			'completed',
		);
		return parsedOutput.data as MaritimeOperationOutputs[Id];
	};
}
