import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { BinaryResponse, FileInput } from 'corsair/http';
import { resolveFileInput, toFileOutput } from 'corsair/http';
import type { MoneybirdRequest } from '../client';
import {
	MONEYBIRD_PAGE_SIZE,
	MONEYBIRD_UPLOAD_MAX_BYTES,
	makeMoneybirdRequest,
} from '../client';
import type { MoneybirdContext } from '../index';
import type { MoneybirdOperationDefinition } from './manifest';
import {
	getMoneybirdInputSchema,
	getMoneybirdOutputSchema,
	MASKED_KEY,
	maskedIssuePath,
	moneybirdInputFields,
	moneybirdOperationFor,
	numbersFromStrings,
} from './openapi-schema';
import type {
	MoneybirdOperationId,
	MoneybirdOperationInputs,
	MoneybirdOperationOutputs,
} from './operation-types';

export type MoneybirdOperationEndpoint<Id extends MoneybirdOperationId> =
	CorsairEndpoint<
		MoneybirdContext,
		MoneybirdOperationInputs[Id],
		MoneybirdOperationOutputs[Id]
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
										moneybirdInputFields(id)
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
	operation: MoneybirdOperationDefinition,
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
	operation: MoneybirdOperationDefinition,
	// `unknown` because the body fields are validated per operation.
	body: Record<string, unknown>,
): Promise<FormData> {
	const files = fileFields(operation);
	const form = new FormData();
	for (const [name, value] of Object.entries(body)) {
		if (value === undefined || value === null) continue;
		if (files.has(name) && (isFileValue(value) || typeof value === 'string')) {
			const resolved = await resolveFileInput(value as FileInput, {
				maxBytes: MONEYBIRD_UPLOAD_MAX_BYTES,
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

/** File extensions for the content types Moneybird's downloads come back as. */
const EXTENSIONS: Record<string, string> = {
	'application/pdf': 'pdf',
	'application/xml': 'xml',
	'text/xml': 'xml',
	'application/zip': 'zip',
	'text/csv': 'csv',
	'image/png': 'png',
	'image/jpeg': 'jpg',
};

/**
 * What to call a downloaded file, from the operation, the call's record id
 * and the content type: `moneybird-sales-invoices-download-pdf-123.pdf`.
 */
// `unknown` because each operation's validated input has its own fields.
export function fileNameFor(
	id: string,
	input: Record<string, unknown>,
	contentType?: string | null,
): string {
	const what = id
		.replace(/\./g, '-')
		.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
	const record = input.id ?? input.attachment_id;
	const ref =
		typeof record === 'string' || typeof record === 'number'
			? `-${String(record).replace(/[^0-9A-Za-z_-]/g, '')}`
			: '';
	const type = (contentType ?? '').split(';')[0]?.trim().toLowerCase() ?? '';
	const extension = EXTENSIONS[type];
	return `moneybird-${what}${ref}${extension ? `.${extension}` : ''}`;
}

/**
 * The page a full page leads to. Moneybird's next page is in a Link header
 * core doesn't return, so a page that came back with `per_page` entries (the
 * plugin sends 100 when the caller leaves it out) is taken to have a next
 * one; a shorter page is the last.
 */
// `unknown` because the input was validated against an open schema.
export function nextPageOf(
	input: Record<string, unknown>,
	count: number,
): number | null {
	// Moneybird takes `page` and `per_page` as a number or a digit string.
	const page = positiveInteger(input.page) ?? 1;
	const perPage = positiveInteger(input.per_page) ?? MONEYBIRD_PAGE_SIZE;
	return count >= perPage ? page + 1 : null;
}

/**
 * A paged list without `per_page` (contacts.listDuplicates): Moneybird sizes
 * its pages by contacts while the body holds groups of them, so a page's
 * length says nothing about what is left. Any page with entries may have a
 * next one; an empty page is the last.
 */
// `unknown` because the input was validated against an open schema.
export function nextPageWhileAny(
	input: Record<string, unknown>,
	count: number,
): number | null {
	return count > 0 ? (positiveInteger(input.page) ?? 1) + 1 : null;
}

function takesPageSize(operation: MoneybirdOperationDefinition): boolean {
	const properties = operation.input.properties;
	return (
		typeof properties === 'object' &&
		properties !== null &&
		'per_page' in properties
	);
}

// `unknown` because the value is a validated number or digit string.
function positiveInteger(value: unknown): number | undefined {
	const number =
		typeof value === 'number'
			? value
			: typeof value === 'string' && /^\d+$/.test(value)
				? Number(value)
				: undefined;
	return number !== undefined && Number.isInteger(number) && number > 0
		? number
		: undefined;
}

/**
 * Rails-style query keys. A list goes out as `includes[]=a&includes[]=b` (Rails keeps
 * only the last of repeated `includes=`), a map as
 * `custom_properties[Field]=value`, and a list inside it as
 * `custom_properties[Field][]=A`. Core's query string writes `key[k]` for
 * object entries and repeats the key for list items.
 */
// `unknown` because query values are validated scalars, lists or maps.
export function queryEntries(
	name: string,
	value: unknown,
): Record<string, unknown> {
	if (Array.isArray(value)) return { [`${name}[]`]: value };
	if (typeof value === 'object' && value !== null) {
		// `unknown` because map values are validated scalars or lists.
		const entries: Record<string, unknown> = {};
		for (const [key, inner] of Object.entries(value)) {
			Object.assign(entries, queryEntries(`${name}[${key}]`, inner));
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
		// The body itself stays out of the message: it can hold customer data.
		throw new Error(`Moneybird ${id} answered with a body that is not JSON`);
	}
}

/** Routes Moneybird documents as PDF downloads: the bytes must be a PDF. */
const PDF_ROUTES = new Set([
	'salesInvoices.downloadPdf',
	'salesInvoices.downloadPackingSlipPdf',
	'estimates.downloadPdf',
	'estimates.downloadSignedPdf',
]);

/** Routes Moneybird documents as XML (a UBL invoice, a payment batch file). */
const XML_ROUTES = new Set([
	'salesInvoices.downloadUbl',
	'purchaseTransactionBatches.download',
]);

/**
 * A download's body is usable when it isn't empty or an HTML page (a login
 * page, a proxy error). PDF routes must start with `%PDF` and XML routes with
 * `<`; attachments and exports are whatever was uploaded or built.
 */
export function isUsableFile(
	id: string,
	bytes: Uint8Array,
	contentType: string | null | undefined,
): boolean {
	if (bytes.byteLength === 0) return false;
	if ((contentType ?? '').toLowerCase().includes('html')) return false;
	const head = new TextDecoder()
		.decode(bytes.subarray(0, 1024))
		.replace(/^[\s\uFEFF]+/, '');
	if (/^<(!doctype html|html)/i.test(head)) return false;
	if (PDF_ROUTES.has(id)) return head.startsWith('%PDF');
	if (XML_ROUTES.has(id)) return head.startsWith('<');
	return true;
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
 * each named field goes to the path, query string or a header as the spec
 * says, and everything else is the request body.
 */
export function createMoneybirdOperation<Id extends MoneybirdOperationId>(
	id: Id,
): MoneybirdOperationEndpoint<Id> {
	return async (ctx, input) => {
		const operation = moneybirdOperationFor(id);
		const parsedInput = getMoneybirdInputSchema(id).safeParse(input ?? {});
		if (!parsedInput.success) {
			// Paths and messages only: zod's messages name what was expected, not the value sent.
			throw new Error(
				`Invalid input for moneybird ${id}: ${describeIssues(id, parsedInput.error.issues, 'input', 5)}`,
			);
		}
		// Send what was validated, not the caller's object.
		// `unknown` is necessary because the fields differ per operation; each was just validated.
		const valid: Record<string, unknown> = { ...parsedInput.data };

		const pathParameters: Record<string, string> = {};
		// `unknown` because query values are validated scalars, lists or maps.
		const query: Record<string, unknown> = {};
		const headers: Record<string, string> = {};
		for (const field of moneybirdInputFields(id)) {
			if (field.in === 'body') continue;
			const value = valid[field.name];
			delete valid[field.name];
			if (value === undefined || value === null) continue;
			switch (field.in) {
				case 'path':
					pathParameters[field.name] = String(value);
					break;
				case 'header':
					headers[field.header ?? field.name] = String(value);
					break;
				case 'query':
					Object.assign(query, queryEntries(field.name, value));
					break;
			}
		}
		if (
			operation.paginated &&
			takesPageSize(operation) &&
			query.per_page === undefined
		) {
			// Moneybird's default page size differs per route: ask for a known one.
			query.per_page = MONEYBIRD_PAGE_SIZE;
		}

		const request: MoneybirdRequest = {
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
		// Fields Moneybird sets itself never go back, even when the caller passes an object it read.
		for (const name of operation.serverSetFields ?? []) delete valid[name];
		if (operation.request === 'json') request.body = valid;
		else if (operation.request === 'multipart') {
			request.body = await buildForm(operation, valid);
		}

		// `unknown` because the response is untrusted until the output schema parses it.
		let response: unknown;
		if (operation.response === 'file') {
			request.responseType = 'binary';
			const binary = await makeMoneybirdRequest(ctx, request);
			if (!isBinaryResponse(binary))
				throw new Error('Moneybird returned no file');
			// An empty body or an HTML page (a proxy, a login redirect) is an
			// error, not a file.
			if (!isUsableFile(id, binary.bytes, binary.contentType)) {
				throw new Error(`Moneybird ${id} answered without a file`);
			}
			response = toFileOutput(binary.bytes, binary.contentType, {
				filename: fileNameFor(id, parsedInput.data, binary.contentType),
			});
		} else if (operation.response === 'empty') {
			// The spec documents no body, so the 2xx status is the answer. A body
			// is still read: JSON (Moneybird answering anyway) is fine, but bytes that
			// aren't JSON point at something other than Moneybird (a proxy page) and
			// throw instead of counting as a success.
			decodeMaybeEmpty(id, await makeMoneybirdRequest(ctx, request));
			response = { success: true };
		} else {
			let body = await makeMoneybirdRequest(ctx, request);
			if (operation.emptyOk) {
				body = decodeMaybeEmpty(id, body);
			}
			if (body !== EMPTY) body = numbersFromStrings(operation.output, body);
			if (body === EMPTY) {
				response = { success: true };
			} else if (operation.paginated && Array.isArray(body)) {
				response = {
					items: body,
					next_page: takesPageSize(operation)
						? nextPageOf(parsedInput.data, body.length)
						: nextPageWhileAny(parsedInput.data, body.length),
				};
			} else {
				response = body;
			}
		}

		// The output schema is built from the documented response; a body that
		// doesn't match it is an error, never replaced with a default.
		const parsedOutput = getMoneybirdOutputSchema(id).safeParse(response);
		if (!parsedOutput.success) {
			throw new Error(
				`Moneybird ${id} response did not match its documented schema: ${describeIssues(id, parsedOutput.error.issues, 'output', 3)}`,
			);
		}

		// Inputs and results hold customer, contact, invoice and payroll data:
		// log only which operation ran.
		await logEventFromContext(
			ctx,
			'moneybird.operation',
			{ operationId: id },
			'completed',
		);
		return parsedOutput.data as MoneybirdOperationOutputs[Id];
	};
}
