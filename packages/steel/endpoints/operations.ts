import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { BinaryResponse, FileInput } from 'corsair/http';
import { resolveFileInput, toFileOutput } from 'corsair/http';
import type { SteelRequest } from '../client';
import { makeSteelRequest, STEEL_UPLOAD_MAX_BYTES } from '../client';
import type { SteelContext } from '../index';
import type { SteelOperationDefinition } from './manifest';
import {
	getSteelInputSchema,
	getSteelOutputSchema,
	MASKED_KEY,
	maskedIssuePath,
	steelInputFields,
	steelOperationFor,
} from './openapi-schema';
import type {
	SteelOperationId,
	SteelOperationInputs,
	SteelOperationOutputs,
} from './operation-types';

export type SteelOperationEndpoint<Id extends SteelOperationId> =
	CorsairEndpoint<
		SteelContext,
		SteelOperationInputs[Id],
		SteelOperationOutputs[Id]
	>;

type Issue = {
	path: readonly PropertyKey[];
	message: string;
	code?: string;
	keys?: readonly string[];
};

/**
 * Issue paths and zod's messages, which name what was expected rather than the
 * value sent. Map keys (metadata keys) are masked, and so is every unknown key
 * the caller sent; the message lists the fields the operation takes instead.
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
										steelInputFields(id)
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

/** Top-level input fields that hold a file. */
export function fileFields(operation: SteelOperationDefinition): Set<string> {
	const names = new Set<string>();
	const properties = operation.input.properties;
	if (typeof properties !== 'object' || properties === null) return names;
	for (const [name, schema] of Object.entries(properties)) {
		if (typeof schema !== 'object' || schema === null) continue;
		// `unknown` because a property schema is raw provider JSON Schema.
		const record = schema as Record<string, unknown>;
		const items = record.items as Record<string, unknown> | undefined;
		if (record.format === 'binary' || items?.format === 'binary') {
			names.add(name);
		}
	}
	return names;
}

// `unknown` because the value is a validated file input of any accepted form.
async function bytesOf(value: unknown) {
	return resolveFileInput(value as FileInput, {
		maxBytes: STEEL_UPLOAD_MAX_BYTES,
		fallbackName: 'file',
	});
}

/**
 * The multipart form for an upload route. Each file field is turned into bytes
 * with core's `resolveFileInput` (a public URL is downloaded, base64 is
 * decoded) before the form is built; a bare string in a file field is a URL.
 * Other values go as text (objects and lists as JSON).
 */
async function buildForm(
	operation: SteelOperationDefinition,
	// `unknown` because the body fields are validated per operation.
	body: Record<string, unknown>,
	wire: (name: string) => string,
): Promise<FormData> {
	const files = fileFields(operation);
	const form = new FormData();
	for (const [name, value] of Object.entries(body)) {
		if (value === undefined || value === null) continue;
		const key = wire(name);
		if (files.has(name)) {
			const list = Array.isArray(value) ? value : [value];
			for (const item of list) {
				if (isFileValue(item) || typeof item === 'string') {
					const resolved = await bytesOf(item);
					form.append(key, resolved.file, resolved.filename);
				}
			}
		} else if (Array.isArray(value)) {
			for (const item of value) {
				form.append(
					key,
					typeof item === 'object' ? JSON.stringify(item) : String(item),
				);
			}
		} else {
			form.append(
				key,
				typeof value === 'object' ? JSON.stringify(value) : String(value),
			);
		}
	}
	return form;
}

/** File extensions for the content types downloads come back as. */
const EXTENSIONS: Record<string, string> = {
	'application/pdf': 'pdf',
	'application/zip': 'zip',
	'application/json': 'json',
	'text/csv': 'csv',
	'text/plain': 'txt',
	'image/png': 'png',
	'image/jpeg': 'jpg',
	'image/webp': 'webp',
	'video/mp4': 'mp4',
	'application/vnd.apple.mpegurl': 'm3u8',
	'application/x-mpegurl': 'm3u8',
};

/**
 * What to call a downloaded file, from the operation and the content type:
 * `steel-sessions-downloads-list.zip`.
 */
export function fileNameFor(id: string, contentType?: string | null): string {
	const what = id
		.replace(/\./g, '-')
		.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
	const type = (contentType ?? '').split(';')[0]?.trim().toLowerCase() ?? '';
	const extension = EXTENSIONS[type];
	return `steel-${what}${extension ? `.${extension}` : ''}`;
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
		// The body itself stays out of the message: it can hold user data.
		throw new Error(`Steel ${id} answered with a body that is not JSON`);
	}
}

/**
 * A download's body is usable when it isn't empty or an HTML page (a login
 * page, a proxy error), unless the route documents HTML.
 */
export function isUsableFile(
	operation: SteelOperationDefinition,
	bytes: Uint8Array,
	contentType: string | null | undefined,
): boolean {
	if (bytes.byteLength === 0) return false;
	if ((operation.fileTypes ?? []).some((type) => type.includes('html')))
		return true;
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
 * Query values: lists repeat the key (or go out as one joined value where
 * the spec says `explode: false`), maps go out as JSON.
 */
// `unknown` because query values are validated scalars, lists or maps.
export function queryValue(value: unknown, join?: string): unknown {
	if (Array.isArray(value) && join !== undefined) {
		return value.map(String).join(join);
	}
	if (Array.isArray(value)) {
		return value.map((item) =>
			typeof item === 'object' && item !== null ? JSON.stringify(item) : item,
		);
	}
	if (typeof value === 'object' && value !== null) return JSON.stringify(value);
	return value;
}

/**
 * A path value that may hold slashes (`downloads/report.pdf`): each segment is
 * encoded on its own, so the slashes stay and nothing else can change the
 * route. Empty, `.` and `..` segments are refused.
 */
export function encodeSlashPath(value: string): string {
	const segments = value.replace(/^\/+/, '').split('/');
	if (segments.some((part) => part === '' || part === '.' || part === '..')) {
		throw new Error('Invalid Steel file path');
	}
	return segments.map(encodeURIComponent).join('/');
}

/**
 * One endpoint per manifest operation. The caller passes one flat object;
 * each named field goes to the path, query string or a header as the spec
 * says, and everything else is the request body.
 */
export function createSteelOperation<Id extends SteelOperationId>(
	id: Id,
): SteelOperationEndpoint<Id> {
	return async (ctx, input) => {
		const operation = steelOperationFor(id);
		const parsedInput = getSteelInputSchema(id).safeParse(input ?? {});
		if (!parsedInput.success) {
			// Paths and messages only: zod's messages name what was expected, not the value sent.
			throw new Error(
				`Invalid input for steel ${id}: ${describeIssues(id, parsedInput.error.issues, 'input', 5)}`,
			);
		}
		// Send what was validated, not the caller's object.
		// `unknown` is necessary because the fields differ per operation; each was just validated.
		const valid: Record<string, unknown> = { ...parsedInput.data };
		const fields = steelInputFields(id);
		const wireNames = new Map(fields.map((field) => [field.name, field.wire]));
		const wire = (name: string) => wireNames.get(name) ?? name;

		const pathParameters: Record<string, string> = {};
		// `unknown` because query values are validated scalars or lists.
		const query: Record<string, unknown> = {};
		const headers: Record<string, string> = {};
		// `unknown` because a raw body is a validated JSON value or a file.
		let rawBody: unknown;
		for (const field of fields) {
			if (field.in === 'body') continue;
			const value = valid[field.name];
			delete valid[field.name];
			if (value === undefined) continue;
			if (field.in === 'rawBody') {
				rawBody = value;
				continue;
			}
			if (value === null) continue;
			switch (field.in) {
				case 'path':
					pathParameters[field.wire] = String(value);
					break;
				case 'header':
					headers[field.header ?? field.wire] = String(value);
					break;
				case 'query':
					query[field.wire] = queryValue(value, field.join);
					break;
			}
		}

		// Slash-keeping values go into the route here; core encodes the rest.
		let path = operation.path;
		for (const field of fields) {
			if (!field.slashes || pathParameters[field.wire] === undefined) continue;
			path = path.replace(
				`{${field.wire}}`,
				encodeSlashPath(pathParameters[field.wire] as string),
			);
			delete pathParameters[field.wire];
		}

		const request: SteelRequest = {
			method: operation.method,
			path,
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
		// Fields the vendor sets itself never go back, even when the caller passes an object it read.
		for (const name of operation.serverSetFields ?? []) delete valid[name];
		// `unknown` because each body field keeps its validated type.
		const body: Record<string, unknown> = {};
		for (const [name, value] of Object.entries(valid)) {
			if (value !== undefined) body[wire(name)] = value;
		}
		if (operation.request === 'json') {
			request.body = operation.bodyField ? rawBody : body;
		} else if (operation.request === 'multipart') {
			request.body = await buildForm(operation, valid, wire);
		} else if (operation.request === 'form') {
			const form = new URLSearchParams();
			for (const [name, value] of Object.entries(body)) {
				if (value === null) continue;
				form.append(
					name,
					typeof value === 'object' ? JSON.stringify(value) : String(value),
				);
			}
			request.body = form.toString();
			request.mediaType = 'application/x-www-form-urlencoded';
		} else if (operation.request === 'binary') {
			const resolved = await bytesOf(rawBody);
			request.body = resolved.file;
			request.mediaType = operation.bodyMediaType;
		}

		// `unknown` because the response is untrusted until the output schema parses it.
		let response: unknown;
		if (operation.response === 'file') {
			request.responseType = 'binary';
			const binary = await makeSteelRequest(ctx, request);
			if (!isBinaryResponse(binary)) throw new Error('Steel returned no file');
			if (!isUsableFile(operation, binary.bytes, binary.contentType)) {
				throw new Error(`Steel ${id} answered without a file`);
			}
			response = toFileOutput(binary.bytes, binary.contentType, {
				filename: fileNameFor(id, binary.contentType),
			});
		} else if (operation.response === 'text') {
			request.responseType = 'binary';
			request.headers = {
				Accept: 'text/plain, text/markdown, */*',
				...headers,
			};
			const binary = await makeSteelRequest(ctx, request);
			if (!isBinaryResponse(binary)) throw new Error('Steel returned no body');
			response = {
				text: new TextDecoder().decode(binary.bytes),
				contentType: binary.contentType ?? null,
			};
		} else if (operation.response === 'empty') {
			// The spec documents no body, so the 2xx status is the answer. A body
			// is still read: JSON is fine, but bytes that aren't JSON point at
			// something other than Steel (a proxy page) and throw instead of
			// counting as a success.
			decodeMaybeEmpty(id, await makeSteelRequest(ctx, request));
			response = { success: true };
		} else {
			let result = await makeSteelRequest(ctx, request);
			if (operation.emptyOk) {
				result = decodeMaybeEmpty(id, result);
			}
			response = result === EMPTY ? { success: true } : result;
		}

		// The output schema is built from the documented response; a body that
		// doesn't match it is an error, never replaced with a default.
		const parsedOutput = getSteelOutputSchema(id).safeParse(response);
		if (!parsedOutput.success) {
			throw new Error(
				`Steel ${id} response did not match its documented schema: ${describeIssues(id, parsedOutput.error.issues, 'output', 3)}`,
			);
		}

		// Inputs and results hold site credentials, cookies, page content and files: log only which operation ran.
		await logEventFromContext(
			ctx,
			'steel.operation',
			{ operationId: id },
			'completed',
		);
		return parsedOutput.data as SteelOperationOutputs[Id];
	};
}
