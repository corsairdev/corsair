import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { BinaryResponse, FileInput } from 'corsair/http';
import { resolveFileInput, toFileOutput } from 'corsair/http';
import type { PaypalRequest } from '../client';
import {
	encodePaypalPathValue,
	makePaypalRequest,
	PAYPAL_UPLOAD_MAX_BYTES,
} from '../client';
import type { PaypalContext } from '../index';
import type { PaypalOperationDefinition } from './manifest';
import {
	getPaypalInputSchema,
	getPaypalOutputSchema,
	MASKED_KEY,
	maskedIssuePath,
	paypalInputFields,
	paypalOperationFor,
} from './openapi-schema';
import type {
	PaypalOperationId,
	PaypalOperationInputs,
	PaypalOperationOutputs,
} from './operation-types';

export type PaypalOperationEndpoint<Id extends PaypalOperationId> =
	CorsairEndpoint<
		PaypalContext,
		PaypalOperationInputs[Id],
		PaypalOperationOutputs[Id]
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
										paypalInputFields(id)
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

// `unknown` because the value came from core's binary transport.
function isBinaryResponse(value: unknown): value is BinaryResponse {
	return (
		typeof value === 'object' &&
		value !== null &&
		'bytes' in value &&
		value.bytes instanceof Uint8Array
	);
}

/** Body fields that hold a file (the dispute documents). */
export function fileFields(operation: PaypalOperationDefinition): Set<string> {
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
 * The multipart form for a dispute route: each file field becomes bytes with
 * core's `resolveFileInput`, and an object (the `input` part with evidences or
 * notes) goes as a JSON part, which is how PayPal reads it.
 */
async function buildForm(
	operation: PaypalOperationDefinition,
	// `unknown` because the body fields are validated per operation.
	body: Record<string, unknown>,
): Promise<FormData> {
	const files = fileFields(operation);
	const form = new FormData();
	for (const [name, value] of Object.entries(body)) {
		if (value === undefined || value === null) continue;
		if (files.has(name)) {
			const resolved = await resolveFileInput(value as FileInput, {
				maxBytes: PAYPAL_UPLOAD_MAX_BYTES,
				fallbackName: 'document',
			});
			form.append(name, resolved.file, resolved.filename);
		} else if (typeof value === 'object') {
			form.append(
				name,
				new Blob([JSON.stringify(value)], { type: 'application/json' }),
			);
		} else {
			form.append(name, String(value));
		}
	}
	return form;
}

/** Marks a 2xx that came back without a body. */
const EMPTY = Symbol('empty');

/**
 * A route documented as JSON or 204 is read as bytes: nothing is a bodiless
 * success, anything else must be JSON (never a made-up success).
 */
// `unknown` because the value came from core's binary transport.
export function decodeMaybeEmpty(id: string, value: unknown): unknown {
	if (!isBinaryResponse(value)) return value;
	const text = new TextDecoder().decode(value.bytes);
	if (text.trim().length === 0) return EMPTY;
	try {
		return JSON.parse(text);
	} catch {
		throw new Error(`PayPal ${id} answered with a body that is not JSON`);
	}
}

/** Invoicing routes that return a bare link unless sent `Prefer: return=representation`. */
const PAYPAL_RETURN_REPRESENTATION: ReadonlySet<string> = new Set([
	'invoices.create',
	'invoices.update',
	'invoices.templates.create',
	'invoices.templates.update',
]);

/**
 * The QR code route answers `multipart/form-data` with one part, `image`,
 * whose body is the PNG in base64 (checked live on the sandbox, 11-27). Plain
 * base64 text and raw PNG bytes are accepted too.
 */
export function decodePaypalQrBody(raw: Uint8Array): Uint8Array {
	let text = new TextDecoder().decode(raw).trim();
	if (text.startsWith('--')) {
		const boundary = text.slice(0, text.search(/\r?\n/));
		const headerEnd = text.search(/\r?\n\r?\n/);
		const partEnd = text.indexOf(boundary, boundary.length);
		if (headerEnd > 0 && partEnd > headerEnd) {
			text = text.slice(headerEnd, partEnd).trim();
		}
	}
	return /^[A-Za-z0-9+/=\s]+$/.test(text)
		? Uint8Array.from(Buffer.from(text, 'base64'))
		: raw;
}

/**
 * One endpoint per manifest operation. The caller passes one flat object;
 * each named field goes to the path or query string as the route says, and
 * everything else is the JSON body.
 */
export function createPaypalOperation<Id extends PaypalOperationId>(
	id: Id,
): PaypalOperationEndpoint<Id> {
	return async (ctx, input) => {
		const operation = paypalOperationFor(id);
		const parsedInput = getPaypalInputSchema(id).safeParse(input ?? {});
		if (!parsedInput.success) {
			// Paths and messages only: zod's messages name what was expected, not the value sent.
			throw new Error(
				`Invalid input for paypal ${id}: ${describeIssues(id, parsedInput.error.issues, 'input', 5)}`,
			);
		}
		// Send what was validated, not the caller's object.
		// `unknown` is necessary because the fields differ per operation; each was just validated.
		const valid: Record<string, unknown> = { ...parsedInput.data };

		const pathParameters: Record<string, string> = {};
		// `unknown` because query values are validated scalars.
		const query: Record<string, unknown> = {};
		const headers: Record<string, string> = {};
		// `unknown` because body values are validated per operation.
		const body: Record<string, unknown> = {};
		const named = new Set<string>();
		for (const field of paypalInputFields(id)) {
			named.add(field.name);
			const value = valid[field.name];
			if (value === undefined) continue;
			// An explicit null is a value in a body; in a path, query or header it
			// means "not set".
			if (value === null && field.in !== 'body') continue;
			switch (field.in) {
				case 'path':
					pathParameters[field.wire] = encodePaypalPathValue(String(value));
					break;
				case 'query':
					query[field.wire] = Array.isArray(value) ? value.join(',') : value;
					break;
				case 'header':
					headers[field.wire] = String(value);
					break;
				default:
					body[field.wire] = value;
			}
		}
		// Keys the schema let through (objects keep unknown keys, such as a
		// field PayPal adds) go in the body.
		for (const [name, value] of Object.entries(valid)) {
			if (!named.has(name) && value !== undefined) body[name] = value;
		}

		// Invoicing answers a create or update with only a link to the resource
		// unless asked for the representation; ask, so the reply is the documented
		// invoice or template (checked live on the sandbox, 11-27).
		if (PAYPAL_RETURN_REPRESENTATION.has(id) && headers.Prefer === undefined) {
			headers.Prefer = 'return=representation';
		}

		const request: PaypalRequest = {
			method: operation.method,
			path: operation.path,
			pathParameters,
			query,
			headers,
		};
		if (operation.request === 'json') request.body = body;
		else if (operation.request === 'json-array') {
			request.body = Array.isArray(body.patch) ? body.patch : [];
		} else if (operation.request === 'multipart') {
			request.body = await buildForm(operation, body);
		} else if (operation.method === 'POST') {
			// PayPal refuses a bodiless POST without a JSON content type on some
			// routes (activate, void, cancel item): send an empty object.
			request.body = {};
		}

		// `unknown` because the response is untrusted until the output schema parses it.
		let response: unknown;
		if (operation.response === 'file') {
			request.responseType = 'binary';
			// The QR code route answers 406 to `Accept: application/json` (and to
			// image/png or text/plain); it only serves a request that accepts anything.
			request.headers = { ...request.headers, Accept: '*/*' };
			const binary = await makePaypalRequest(ctx, request);
			if (!isBinaryResponse(binary) || binary.bytes.byteLength === 0) {
				throw new Error(`PayPal ${id} answered without a file`);
			}
			const bytes = decodePaypalQrBody(binary.bytes);
			response = toFileOutput(bytes, 'image/png', {
				filename: `paypal-${id.replace(/\./g, '-')}.png`,
			});
		} else if (operation.response === 'empty') {
			request.responseType = 'binary';
			decodeMaybeEmpty(id, await makePaypalRequest(ctx, request));
			response = { success: true };
		} else {
			if (operation.emptyOk) request.responseType = 'binary';
			let raw = await makePaypalRequest(ctx, request);
			if (operation.emptyOk) raw = decodeMaybeEmpty(id, raw);
			response = raw === EMPTY ? { success: true } : raw;
		}

		// The output schema is built from the route's own schema; a body that
		// doesn't match it is an error, never replaced with a default.
		const parsedOutput = getPaypalOutputSchema(id).safeParse(response);
		if (!parsedOutput.success) {
			throw new Error(
				`PayPal ${id} response did not match its documented schema: ${describeIssues(id, parsedOutput.error.issues, 'output', 3)}`,
			);
		}

		// Inputs and results hold payers' names, addresses, card and bank
		// details: log only which operation ran.
		await logEventFromContext(
			ctx,
			'paypal.operation',
			{ operationId: id },
			'completed',
		);
		return parsedOutput.data as PaypalOperationOutputs[Id];
	};
}
