import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { BinaryResponse, FileInput } from 'corsair/http';
import { resolveFileInput, toFileOutput } from 'corsair/http';
import type { AzureDevopsRequest } from '../client';
import {
	AZUREDEVOPS_UPLOAD_MAX_BYTES,
	makeAzureDevopsHeaderPagedRequest,
	makeAzureDevopsHeaderRequest,
	makeAzureDevopsRequest,
} from '../client';
import type { AzureDevopsContext } from '../index';
import type { AzureDevopsOperationDefinition } from './manifest';
import {
	azuredevopsInputFields,
	azuredevopsOperationFor,
	customerMapKeys,
	getAzureDevopsInputSchema,
	getAzureDevopsOutputSchema,
	MASKED_KEY,
	maskedIssuePath,
} from './openapi-schema';
import type {
	AzureDevopsOperationId,
	AzureDevopsOperationInputs,
	AzureDevopsOperationOutputs,
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

export type AzureDevopsOperationEndpoint<Id extends AzureDevopsOperationId> =
	CorsairEndpoint<
		AzureDevopsContext,
		AzureDevopsOperationInputs[Id],
		AzureDevopsOperationOutputs[Id]
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
										azuredevopsInputFields(id)
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
	operation: AzureDevopsOperationDefinition,
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
async function bytesOf(
	value: unknown,
	maxBytes = AZUREDEVOPS_UPLOAD_MAX_BYTES,
) {
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
	operation: AzureDevopsOperationDefinition,
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
 * `azuredevops-sessions-downloads-list.zip`.
 */
export function fileNameFor(id: string, contentType?: string | null): string {
	const what = id
		.replace(/\./g, '-')
		.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
	const type = (contentType ?? '').split(';')[0]?.trim().toLowerCase() ?? '';
	const extension = EXTENSIONS[type];
	return `azuredevops-${what}${extension ? `.${extension}` : ''}`;
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
		throw new Error(`Azure DevOps ${id} answered with a body that is not JSON`);
	}
}

/**
 * A download's body is usable when it isn't empty or an HTML page (a login
 * page, a proxy error), unless the route documents HTML.
 */
export function isUsableFile(
	operation: AzureDevopsOperationDefinition,
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
 * A path value that may hold slashes (`downloads/report.pdf`): each segment is
 * encoded on its own, so the slashes stay and nothing else can change the
 * route. Empty, `.` and `..` segments are refused.
 */
export function encodeSlashPath(value: string): string {
	const segments = value.replace(/^\/+/, '').split('/');
	if (segments.some((part) => part === '' || part === '.' || part === '..')) {
		throw new Error('Invalid Azure DevOps file path');
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
			`Azure DevOps ${id} sent a ${header} header that is not a token`,
		);
	}
	return value;
}

/**
 * One endpoint per manifest operation. The caller passes one flat object;
 * each named field goes to the path, query string or a header as the spec
 * says, and everything else is the request body.
 */
export function createAzureDevopsOperation<Id extends AzureDevopsOperationId>(
	id: Id,
): AzureDevopsOperationEndpoint<Id> {
	return async (ctx, input) => {
		const operation = azuredevopsOperationFor(id);
		const parsedInput = getAzureDevopsInputSchema(id).safeParse(input ?? {});
		if (!parsedInput.success) {
			// Paths and messages only: zod's messages name what was expected, not the value sent.
			throw new Error(
				`Invalid input for azuredevops ${id}: ${describeIssues(id, parsedInput.error.issues, 'input', 5)}`,
			);
		}
		// Send what was validated, not the caller's object.
		// `unknown` is necessary because the fields differ per operation; each was just validated.
		const valid: Record<string, unknown> = { ...parsedInput.data };
		const fields = azuredevopsInputFields(id);
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
		// An optional segment that wasn't given leaves the route without it
		// (`/{project}/{team}/_apis/...` without a team is the default team).
		let route = operation.path;
		for (const field of fields) {
			if (field.optionalSegment && pathParameters[field.wire] === undefined) {
				route = route.replace(`/{${field.wire}}`, '');
			}
		}
		for (const field of fields) {
			const value = pathParameters[field.wire];
			if (!field.slashes || value === undefined) continue;
			pathParameters[field.wire] = encodeSlashPath(value);
			rawPathValues.add(pathParameters[field.wire] as string);
		}

		const request: AzureDevopsRequest = {
			method: operation.method,
			path: route,
			...(rawPathValues.size > 0 ? { rawPathValues } : {}),
			pathParameters,
			query: { ...query, ...operation.fixedQuery },
			headers,
			// A route that may answer with no body is read as bytes: core turns
			// both an empty body and JSON it can't decode into `undefined`, and
			// only the second is an error.
			...(operation.emptyOk || operation.response === 'empty'
				? { responseType: 'binary' as const }
				: {}),
			...(operation.timeoutMs ? { timeoutMs: operation.timeoutMs } : {}),
			...(operation.singleAttempt ? { singleAttempt: true } : {}),
			...(operation.host ? { host: operation.host } : {}),
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
			if (operation.bodyMediaType) request.mediaType = operation.bodyMediaType;
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
			const resolved = await bytesOf(rawBody, operation.maxUploadBytes);
			request.body = operation.base64Body
				? Buffer.from(await resolved.file.arrayBuffer()).toString('base64')
				: resolved.file;
			request.mediaType = operation.bodyMediaType;
		}

		// `unknown` because the response is untrusted until the output schema parses it.
		let response: unknown;
		if (operation.response === 'file') {
			request.responseType = 'binary';
			// A download asks for the types the route documents: some answer 400
			// to `application/json` or `*/*` (Azure DevOps blob zips).
			if (operation.fileTypes?.length) {
				request.headers = {
					Accept: operation.fileTypes.join(', '),
					...headers,
				};
			}
			const binary = await makeAzureDevopsRequest(ctx, request);
			if (!isBinaryResponse(binary))
				throw new Error('Azure DevOps returned no file');
			if (!isUsableFile(operation, binary.bytes, binary.contentType)) {
				throw new Error(`Azure DevOps ${id} answered without a file`);
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
			const binary = await makeAzureDevopsRequest(ctx, request);
			if (!isBinaryResponse(binary))
				throw new Error('Azure DevOps returned no body');
			// A text route answers text or newline-delimited JSON (a command's
			// output stream); an HTML page is a proxy or login page.
			const type = (binary.contentType ?? '').toLowerCase();
			const textual =
				type.startsWith('text/') || type.startsWith('application/x-ndjson');
			if (!textual || type.startsWith('text/html')) {
				throw new Error(
					`Azure DevOps ${id} answered with ${type || 'no content type'}, not text`,
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
						`Azure DevOps ${id} stream ended with an error frame (${failure})`,
					);
				}
			}
			if (type.startsWith('text/event-stream')) {
				const failure = streamError((response as { text: string }).text);
				if (failure) {
					throw new Error(
						`Azure DevOps ${id} stream ended with an error event (${failure})`,
					);
				}
			}
		} else if (operation.response === 'empty') {
			// The spec documents no body, so the 2xx status is the answer. A body
			// is still read: JSON is fine, but bytes that aren't JSON point at
			// something other than Azure DevOps (a proxy page) and throw instead of
			// counting as a success.
			decodeMaybeEmpty(id, await makeAzureDevopsRequest(ctx, request));
			response = { success: true };
		} else if (operation.responseHeader) {
			const kept = operation.responseHeader;
			const answer = await makeAzureDevopsHeaderRequest(
				ctx,
				request,
				kept.header,
			);
			response = {
				...(answer.body as Record<string, unknown>),
				[kept.field]: answer.header,
			};
		} else if (operation.headerCursor) {
			const paging = operation.headerCursor;
			const page = await makeAzureDevopsHeaderPagedRequest(
				ctx,
				request,
				paging.header,
			);
			response = {
				[paging.items]: page.body,
				nextCursor: nextCursorFrom(id, paging.header, page.header),
			};
		} else {
			let result = await makeAzureDevopsRequest(ctx, request);
			// Core hands back a non-JSON body as a string; an HTML page there is a
			// proxy or login page, never a Azure DevOps answer.
			if (typeof result === 'string' && /^\s*<(!doctype|html)/i.test(result)) {
				throw new Error(
					`Azure DevOps ${id} answered with an HTML page, not JSON`,
				);
			}
			if (operation.emptyOk) {
				result = decodeMaybeEmpty(id, result);
			}
			response = result === EMPTY ? { success: true } : result;
		}

		// The output schema is built from the documented response; a body that
		// doesn't match it is an error, never replaced with a default.
		const parsedOutput = getAzureDevopsOutputSchema(id).safeParse(response);
		if (!parsedOutput.success) {
			throw new Error(
				`Azure DevOps ${id} response did not match its documented schema: ${describeIssues(id, parsedOutput.error.issues, 'output', 3)}`,
			);
		}

		// Inputs and results hold source code, work items, pipeline variables, service connection credentials and user emails: log only which operation ran.
		await logEventFromContext(
			ctx,
			'azuredevops.operation',
			{ operationId: id },
			'completed',
		);
		return parsedOutput.data as AzureDevopsOperationOutputs[Id];
	};
}
