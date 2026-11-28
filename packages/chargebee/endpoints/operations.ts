import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { BinaryResponse, FileInput } from 'corsair/http';
import { resolveFileInput, toFileOutput } from 'corsair/http';
import type { ChargebeeRequest } from '../client';
import {
	CHARGEBEE_UPLOAD_MAX_BYTES,
	makeChargebeeHeaderPagedRequest,
	makeChargebeeRequest,
} from '../client';
import type { ChargebeeContext } from '../index';
import type { ChargebeeOperationDefinition } from './manifest';
import {
	chargebeeInputFields,
	chargebeeOperationFor,
	customerMapKeys,
	getChargebeeInputSchema,
	getChargebeeOutputSchema,
	MASKED_KEY,
	maskedIssuePath,
} from './openapi-schema';
import type {
	ChargebeeOperationId,
	ChargebeeOperationInputs,
	ChargebeeOperationOutputs,
} from './operation-types';

/**
 * A server-sent event stream can answer 200 and still end in an `error`
 * event (Zep's graph query does: `{ type: 'error', status, error }`). Such a
 * stream is a failure, not a completed call. Returns what is safe to show
 * (the event's status only: its message can quote the query back), or
 * undefined when no event says error.
 */
export function streamError(text: string): string | undefined {
	let event = '';
	for (const line of text.split(/\r?\n/)) {
		if (line.startsWith('event:')) {
			event = line.slice(6).trim();
			continue;
		}
		if (!line.startsWith('data:')) {
			if (line.trim() === '') event = '';
			continue;
		}
		// `unknown` because each event's data is the vendor's own JSON.
		let parsed: unknown;
		try {
			parsed = JSON.parse(line.slice(5).trim());
		} catch {
			parsed = undefined;
		}
		const record =
			parsed && typeof parsed === 'object'
				? (parsed as Record<string, unknown>)
				: undefined;
		if (event === 'error' || record?.type === 'error') {
			const status = record?.status;
			return typeof status === 'number' || typeof status === 'string'
				? `status ${String(status).slice(0, 12)}`
				: 'no status';
		}
	}
	return undefined;
}

/**
 * A newline-delimited JSON stream (a command's output) ends with exactly one
 * `exit`, `reconnect` or `error` frame. An `error` last frame is a failure
 * even though the response was a 200. Returns what is safe to show (the
 * frame's error code when it is one; its message can quote output), or
 * undefined when the stream did not end in an error.
 */
export function ndjsonError(text: string): string | undefined {
	const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '');
	const last = lines[lines.length - 1];
	if (!last) return undefined;
	// `unknown` because each frame is the vendor's own JSON.
	let frame: unknown;
	try {
		frame = JSON.parse(last);
	} catch {
		return undefined;
	}
	const record =
		frame && typeof frame === 'object'
			? (frame as Record<string, unknown>)
			: undefined;
	if (record?.type !== 'error') return undefined;
	const code = record.error;
	return typeof code === 'string' && /^[a-z0-9_.-]{1,64}$/i.test(code)
		? code
		: 'no code';
}

export type ChargebeeOperationEndpoint<Id extends ChargebeeOperationId> =
	CorsairEndpoint<
		ChargebeeContext,
		ChargebeeOperationInputs[Id],
		ChargebeeOperationOutputs[Id]
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
										chargebeeInputFields(id)
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
export function fileFields(
	operation: ChargebeeOperationDefinition,
): Set<string> {
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
async function bytesOf(value: unknown, maxBytes = CHARGEBEE_UPLOAD_MAX_BYTES) {
	return resolveFileInput(value as FileInput, {
		maxBytes,
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
	operation: ChargebeeOperationDefinition,
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
					const resolved = await bytesOf(item, operation.maxUploadBytes);
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
 * `chargebee-sessions-downloads-list.zip`.
 */
export function fileNameFor(id: string, contentType?: string | null): string {
	const what = id
		.replace(/\./g, '-')
		.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
	const type = (contentType ?? '').split(';')[0]?.trim().toLowerCase() ?? '';
	const extension = EXTENSIONS[type];
	return `chargebee-${what}${extension ? `.${extension}` : ''}`;
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
		throw new Error(`Chargebee ${id} answered with a body that is not JSON`);
	}
}

/**
 * A download's body is usable when it isn't empty or an HTML page (a login
 * page, a proxy error), unless the route documents HTML.
 */
export function isUsableFile(
	operation: ChargebeeOperationDefinition,
	bytes: Uint8Array,
	contentType: string | null | undefined,
): boolean {
	const type = (contentType ?? '').split(';')[0]?.trim().toLowerCase() ?? '';
	if ((operation.fileTypes ?? []).some((t) => t.includes('html'))) return true;
	if (type.includes('html')) return false;
	// A documented file type is the file, whatever its bytes look like (an
	// HTML report downloaded as application/octet-stream). Only a body
	// without a documented type is sniffed for a proxy or login page.
	if (
		bytes.byteLength > 0 &&
		(operation.fileTypes ?? []).some((t) => t.toLowerCase() === type)
	) {
		return true;
	}
	// An empty file is a file when it comes back with a type the route
	// documents; an empty body without one is a proxy or a dropped answer.
	if (bytes.byteLength === 0) {
		return (operation.fileTypes ?? []).some(
			(t) => t.toLowerCase() === type && type !== '',
		);
	}
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
 * the spec says `explode: false`), maps go out as `name[key]=value`.
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
	// A map goes through as is: core writes it as `name[key]=value` (deepObject).
	return value;
}

/**
 * Chargebee's form encoding: nested objects and lists go out in brackets
 * (`billing_address[city]`, `coupon_ids[0]`, and column-wise lists such as
 * `subscription_items[item_price_id][0]`). A free-form map (`meta_data`, an
 * object with no documented fields) goes out as one JSON string, as the API
 * reference asks. Nulls are left out; booleans are `true`/`false`.
 */
// `unknown` because each body field keeps its validated type.
export function chargebeeForm(
	body: Record<string, unknown>,
	freeForm: ReadonlySet<string> = new Set(),
): URLSearchParams {
	const form = new URLSearchParams();
	// `unknown` because values are any validated JSON.
	const add = (key: string, value: unknown, depth: number): void => {
		if (value === null || value === undefined) return;
		if (Array.isArray(value)) {
			value.forEach((item, index) => add(`${key}[${index}]`, item, depth + 1));
			return;
		}
		if (typeof value === 'object') {
			if (depth === 0 && freeForm.has(key)) {
				form.append(key, JSON.stringify(value));
				return;
			}
			for (const [name, inner] of Object.entries(value)) {
				add(`${key}[${name}]`, inner, depth + 1);
			}
			return;
		}
		form.append(key, String(value));
	};
	for (const [name, value] of Object.entries(body)) add(name, value, 0);
	return form;
}

/**
 * The strings a form body carries: every field value, plus every key and
 * leaf value inside free-form JSON fields, at any depth (walked with a stack,
 * so deep metadata can't run out of call stack).
 */
export function formSecrets(
	form: URLSearchParams,
	body: Record<string, unknown>,
	freeForm: ReadonlySet<string>,
): string[] {
	const out = new Set<string>();
	form.forEach((value) => {
		if (value.length >= 2) out.add(value);
	});
	// `unknown` because free-form fields hold any JSON.
	const stack: unknown[] = [...freeForm].map((name) => body[name]);
	while (stack.length > 0) {
		const value = stack.pop();
		if (typeof value === 'string' || typeof value === 'number') {
			const text = String(value);
			if (text.length >= 2) out.add(text);
		} else if (Array.isArray(value)) {
			stack.push(...value);
		} else if (value && typeof value === 'object') {
			for (const [key, inner] of Object.entries(value)) {
				if (key.length >= 2) out.add(key);
				stack.push(inner);
			}
		}
	}
	return [...out];
}

/**
 * Body fields documented as an object with no fields of its own (`meta_data`,
 * `additional_information`): Chargebee takes them as one JSON string.
 */
// `unknown` because the input schema is raw JSON Schema.
export function freeFormFields(input: Record<string, unknown>): Set<string> {
	const properties = (input.properties ?? {}) as Record<
		string,
		Record<string, unknown>
	>;
	return new Set(
		Object.entries(properties)
			.filter(
				([, schema]) =>
					schema.type === 'object' &&
					!schema.properties &&
					(schema['x-corsair-in'] ?? 'body') === 'body',
			)
			.map(([name]) => name),
	);
}

/**
 * A path value that may hold slashes (`downloads/report.pdf`): each segment is
 * encoded on its own, so the slashes stay and nothing else can change the
 * route. Empty, `.` and `..` segments are refused.
 */
export function encodeSlashPath(value: string): string {
	const segments = value.replace(/^\/+/, '').split('/');
	if (segments.some((part) => part === '' || part === '.' || part === '..')) {
		throw new Error('Invalid Chargebee file path');
	}
	return segments.map(encodeURIComponent).join('/');
}

/** The longest next-page token passed back; anything longer is not one. */
const MAX_CURSOR_LENGTH = 8192;

/**
 * The next-page token from a paging header: null when the header is missing
 * or blank (the last page). A value with spaces or non-ASCII characters, or
 * one too long to be a token, is an error rather than a last page, so a
 * broken header never reads as "no more events".
 */
/**
 * Chargebee documents a list's `next_offset` as a string, but sends a JSON
 * array (`["1795842313000","74209"]`) on some lists and a bare number on
 * others (seen live 11-28 on customers, subscriptions, events, coupons, items,
 * item prices, features, entitlements). Each is turned into the string the
 * `offset` input takes back: the array as compact JSON, the number as digits.
 */
export function withStringOffsets(value: unknown): unknown {
	if (typeof value !== 'object' || value === null || Array.isArray(value))
		return value;
	const record = value as Record<string, unknown>;
	let copy: Record<string, unknown> | undefined;
	for (const [key, field] of Object.entries(record)) {
		if (!key.endsWith('next_offset')) continue;
		if (typeof field === 'number' || Array.isArray(field)) {
			copy ??= { ...record };
			copy[key] =
				typeof field === 'number' ? String(field) : JSON.stringify(field);
		}
	}
	return copy ?? value;
}

export function nextCursorFrom(
	id: string,
	header: string,
	raw: string | null,
): string | null {
	if (raw === null) return null;
	const value = raw.trim();
	if (value.length === 0) return null;
	if (value.length > MAX_CURSOR_LENGTH || !/^[\x21-\x7E]+$/.test(value)) {
		throw new Error(
			`Chargebee ${id} sent a ${header} header that is not a token`,
		);
	}
	return value;
}

/**
 * One endpoint per manifest operation. The caller passes one flat object;
 * each named field goes to the path, query string or a header as the spec
 * says, and everything else is the request body.
 */
export function createChargebeeOperation<Id extends ChargebeeOperationId>(
	id: Id,
): ChargebeeOperationEndpoint<Id> {
	return async (ctx, input) => {
		const operation = chargebeeOperationFor(id);
		const parsedInput = getChargebeeInputSchema(id).safeParse(input ?? {});
		if (!parsedInput.success) {
			// Paths and messages only: zod's messages name what was expected, not the value sent.
			throw new Error(
				`Invalid input for chargebee ${id}: ${describeIssues(id, parsedInput.error.issues, 'input', 5)}`,
			);
		}
		// Send what was validated, not the caller's object.
		// `unknown` is necessary because the fields differ per operation; each was just validated.
		const valid: Record<string, unknown> = { ...parsedInput.data };
		const fields = chargebeeInputFields(id);
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

		// Slash-keeping values are encoded here, segment by segment, and sent
		// as they are; the route keeps its placeholder for error URLs.
		const rawPathValues = new Set<string>();
		for (const field of fields) {
			const value = pathParameters[field.wire];
			if (!field.slashes || value === undefined) continue;
			pathParameters[field.wire] = encodeSlashPath(value);
			rawPathValues.add(pathParameters[field.wire] as string);
		}

		const request: ChargebeeRequest = {
			method: operation.method,
			path: operation.path,
			...(rawPathValues.size > 0 ? { rawPathValues } : {}),
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
			...(operation.singleAttempt ? { singleAttempt: true } : {}),
			sensitive: customerMapKeys(operation.input, parsedInput.data),
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
			const freeForm = freeFormFields(operation.input);
			const form = chargebeeForm(body, freeForm);
			request.body = form.toString();
			request.mediaType = 'application/x-www-form-urlencoded';
			// The body goes out as one encoded string, so each value (and each
			// key and value inside a free-form JSON field) is listed for the
			// error scrubber on its own.
			request.sensitive = [
				...(request.sensitive ?? []),
				...formSecrets(form, body, freeForm),
			];
		} else if (operation.request === 'binary') {
			const resolved = await bytesOf(rawBody, operation.maxUploadBytes);
			request.body = resolved.file;
			request.mediaType = operation.bodyMediaType;
		}

		// `unknown` because the response is untrusted until the output schema parses it.
		let response: unknown;
		if (operation.response === 'file') {
			request.responseType = 'binary';
			const binary = await makeChargebeeRequest(ctx, request);
			if (!isBinaryResponse(binary))
				throw new Error('Chargebee returned no file');
			if (!isUsableFile(operation, binary.bytes, binary.contentType)) {
				throw new Error(`Chargebee ${id} answered without a file`);
			}
			response = toFileOutput(binary.bytes, binary.contentType, {
				filename: fileNameFor(id, binary.contentType),
			});
		} else if (operation.response === 'text') {
			request.responseType = 'binary';
			request.headers = {
				Accept: 'application/x-ndjson, text/plain, */*',
				...headers,
			};
			const binary = await makeChargebeeRequest(ctx, request);
			if (!isBinaryResponse(binary))
				throw new Error('Chargebee returned no body');
			// A text route answers text or newline-delimited JSON (a command's
			// output stream); an HTML page is a proxy or login page.
			const type = (binary.contentType ?? '').toLowerCase();
			const textual =
				type.startsWith('text/') || type.startsWith('application/x-ndjson');
			if (!textual || type.startsWith('text/html')) {
				throw new Error(
					`Chargebee ${id} answered with ${type || 'no content type'}, not text`,
				);
			}
			response = {
				text: new TextDecoder().decode(binary.bytes),
				contentType: binary.contentType ?? null,
			};
			if (type.startsWith('application/x-ndjson')) {
				const failure = ndjsonError((response as { text: string }).text);
				if (failure) {
					throw new Error(
						`Chargebee ${id} stream ended with an error frame (${failure})`,
					);
				}
			}
			if (type.startsWith('text/event-stream')) {
				const failure = streamError((response as { text: string }).text);
				if (failure) {
					throw new Error(
						`Chargebee ${id} stream ended with an error event (${failure})`,
					);
				}
			}
		} else if (operation.response === 'empty') {
			// The spec documents no body, so the 2xx status is the answer. A body
			// is still read: JSON is fine, but bytes that aren't JSON point at
			// something other than Chargebee (a proxy page) and throw instead of
			// counting as a success.
			decodeMaybeEmpty(id, await makeChargebeeRequest(ctx, request));
			response = { success: true };
		} else if (operation.headerCursor) {
			const paging = operation.headerCursor;
			const page = await makeChargebeeHeaderPagedRequest(
				ctx,
				request,
				paging.header,
			);
			response = {
				[paging.items]: page.body,
				nextCursor: nextCursorFrom(id, paging.header, page.header),
			};
		} else {
			let result = await makeChargebeeRequest(ctx, request);
			// Core hands back a non-JSON body as a string; an HTML page there is a
			// proxy or login page, never a Chargebee answer.
			if (typeof result === 'string' && /^\s*<(!doctype|html)/i.test(result)) {
				throw new Error(`Chargebee ${id} answered with an HTML page, not JSON`);
			}
			if (operation.emptyOk) {
				result = decodeMaybeEmpty(id, result);
			}
			response =
				result === EMPTY ? { success: true } : withStringOffsets(result);
		}

		// The output schema is built from the documented response; a body that
		// doesn't match it is an error, never replaced with a default.
		const parsedOutput = getChargebeeOutputSchema(id).safeParse(response);
		if (!parsedOutput.success) {
			throw new Error(
				`Chargebee ${id} response did not match its documented schema: ${describeIssues(id, parsedOutput.error.issues, 'output', 3)}`,
			);
		}

		// Inputs and results hold customer details, addresses, payment details and amounts: log only which operation ran.
		await logEventFromContext(
			ctx,
			'chargebee.operation',
			{ operationId: id },
			'completed',
		);
		return parsedOutput.data as ChargebeeOperationOutputs[Id];
	};
}
