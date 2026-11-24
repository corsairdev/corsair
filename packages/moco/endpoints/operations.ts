import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { BinaryResponse, FileInput } from 'corsair/http';
import { resolveFileInput, toFileOutput } from 'corsair/http';
import type { MocoRequest } from '../client';
import {
	MOCO_DEFAULT_PAGE_SIZE,
	MOCO_UPLOAD_MAX_BYTES,
	makeMocoRequest,
} from '../client';
import type { MocoContext } from '../index';
import type { MocoOperationDefinition } from './manifest';
import {
	getMocoInputSchema,
	getMocoOutputSchema,
	MASKED_KEY,
	maskedIssuePath,
	mocoInputFields,
	mocoOperationFor,
} from './openapi-schema';
import type {
	MocoOperationId,
	MocoOperationInputs,
	MocoOperationOutputs,
} from './operation-types';

export type MocoOperationEndpoint<Id extends MocoOperationId> = CorsairEndpoint<
	MocoContext,
	MocoOperationInputs[Id],
	MocoOperationOutputs[Id]
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
										mocoInputFields(id)
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

/** Top-level body fields that hold a file (`file` on purchases.storeDocument). */
export function fileFields(operation: MocoOperationDefinition): Set<string> {
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
	operation: MocoOperationDefinition,
	// `unknown` because the body fields are validated per operation.
	body: Record<string, unknown>,
): Promise<FormData> {
	const files = fileFields(operation);
	const form = new FormData();
	for (const [name, value] of Object.entries(body)) {
		if (value === undefined || value === null) continue;
		if (files.has(name) && (isFileValue(value) || typeof value === 'string')) {
			const resolved = await resolveFileInput(value as FileInput, {
				maxBytes: MOCO_UPLOAD_MAX_BYTES,
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

/** What to call a downloaded PDF, from the operation and the call's inputs. */
// `unknown` because each operation's validated input has its own fields.
export function fileNameFor(
	id: string,
	input: Record<string, unknown>,
): string {
	const what = id
		.replace(/\.getPdf$/, '')
		.replace(/\.getTimesheetPdf$/, '-timesheet')
		.replace(/\./g, '-')
		.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
	const ref = typeof input.id === 'number' ? `-${input.id}` : '';
	return `moco-${what}${ref}.pdf`;
}

/**
 * The page a full page leads to. MOCO's page numbers are in headers core
 * doesn't return, so a page that came back with `per_page` entries (default
 * 100) is taken to have a next one; a shorter page is the last.
 */
// `unknown` because the input was validated against an open schema.
export function nextPageOf(
	input: Record<string, unknown>,
	count: number,
): number | null {
	const page = typeof input.page === 'number' ? input.page : 1;
	const perPage =
		typeof input.per_page === 'number'
			? input.per_page
			: MOCO_DEFAULT_PAGE_SIZE;
	return count >= perPage ? page + 1 : null;
}

/**
 * Rails-style query keys. A list goes out as `kinds[]=a&kinds[]=b` (MOCO keeps
 * only the last of repeated `kinds=`), a map (custom_properties) as
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

// `unknown` because the body is untrusted until the output schema parses it.
function isEmptyBody(body: unknown): boolean {
	return (
		body === undefined ||
		body === null ||
		(typeof body === 'string' && body.trim().length === 0)
	);
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
export function createMocoOperation<Id extends MocoOperationId>(
	id: Id,
): MocoOperationEndpoint<Id> {
	return async (ctx, input) => {
		const operation = mocoOperationFor(id);
		const parsedInput = getMocoInputSchema(id).safeParse(input ?? {});
		if (!parsedInput.success) {
			// Paths and messages only: zod's messages name what was expected, not the value sent.
			throw new Error(
				`Invalid input for moco ${id}: ${describeIssues(id, parsedInput.error.issues, 'input', 5)}`,
			);
		}
		// Send what was validated, not the caller's object.
		// `unknown` is necessary because the fields differ per operation; each was just validated.
		const valid: Record<string, unknown> = { ...parsedInput.data };

		const pathParameters: Record<string, string> = {};
		// `unknown` because query values are validated scalars, lists or maps.
		const query: Record<string, unknown> = {};
		const headers: Record<string, string> = {};
		for (const field of mocoInputFields(id)) {
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

		const request: MocoRequest = {
			method: operation.method,
			path: operation.path,
			pathParameters,
			query,
			headers,
		};
		// Fields MOCO sets itself never go back, even when the caller passes an object it read.
		for (const name of operation.serverSetFields ?? []) delete valid[name];
		if (operation.request === 'json') request.body = valid;
		else if (operation.request === 'multipart') {
			request.body = await buildForm(operation, valid);
		}

		// `unknown` because the response is untrusted until the output schema parses it.
		let response: unknown;
		if (operation.response === 'file') {
			request.responseType = 'binary';
			const binary = await makeMocoRequest(ctx, request);
			if (!isBinaryResponse(binary)) throw new Error('MOCO returned no file');
			response = toFileOutput(binary.bytes, binary.contentType, {
				filename: fileNameFor(id, parsedInput.data),
			});
		} else {
			const body = await makeMocoRequest(ctx, request);
			if (
				operation.response === 'empty' ||
				(operation.emptyOk && isEmptyBody(body))
			) {
				response = { success: true };
			} else if (operation.paginated && Array.isArray(body)) {
				response = {
					items: body,
					next_page: nextPageOf(parsedInput.data, body.length),
				};
			} else {
				response = body;
			}
		}

		// The output schema is built from the documented response; a body that
		// doesn't match it is an error, never replaced with a default.
		const parsedOutput = getMocoOutputSchema(id).safeParse(response);
		if (!parsedOutput.success) {
			throw new Error(
				`MOCO ${id} response did not match its documented schema: ${describeIssues(id, parsedOutput.error.issues, 'output', 3)}`,
			);
		}

		// Inputs and results hold customer, contact, invoice and payroll data:
		// log only which operation ran.
		await logEventFromContext(
			ctx,
			'moco.operation',
			{ operationId: id },
			'completed',
		);
		return parsedOutput.data as MocoOperationOutputs[Id];
	};
}
