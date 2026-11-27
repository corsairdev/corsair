import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { BinaryResponse, FileInput } from 'corsair/http';
import { resolveFileInput, toFileOutput } from 'corsair/http';
import type { FirebaseRequest } from '../client';
import {
	encodeFirebasePathValue,
	FIREBASE_UPLOAD_MAX_BYTES,
	FIREBASE_UPLOAD_TIMEOUT_MS,
	makeFirebaseRequest,
	realtimeDatabaseUrl,
} from '../client';
import type { FirebaseContext } from '../index';
import { firebaseApis } from './manifest';
import {
	firebaseInputFields,
	firebaseOperationFor,
	getFirebaseInputSchema,
	getFirebaseOutputSchema,
	MASKED_KEY,
	maskedIssuePath,
} from './openapi-schema';
import type {
	FirebaseOperationId,
	FirebaseOperationInputs,
	FirebaseOperationOutputs,
} from './operation-types';

export type FirebaseOperationEndpoint<Id extends FirebaseOperationId> =
	CorsairEndpoint<
		FirebaseContext,
		FirebaseOperationInputs[Id],
		FirebaseOperationOutputs[Id]
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
										firebaseInputFields(id)
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
		throw new Error(`Firebase ${id} answered with a body that is not JSON`);
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

/** The JSON value a Realtime Database query parameter needs (`"name"`, `5`). */
// `unknown` because a filter value is any JSON scalar.
function databaseQueryValue(name: string, value: unknown): unknown {
	if (
		name === 'orderBy' ||
		name === 'startAt' ||
		name === 'endAt' ||
		name === 'equalTo'
	) {
		// orderBy is already a quoted key or "$key"; the others are JSON-encoded
		// unless the caller passed a number or boolean.
		if (typeof value === 'string' && name !== 'orderBy') {
			return value.startsWith('"') ? value : JSON.stringify(value);
		}
		if (name === 'orderBy' && typeof value === 'string') {
			return value.startsWith('"') ? value : JSON.stringify(value);
		}
		return JSON.stringify(value);
	}
	return value;
}

/** File extensions for the content types downloads come back as. */
const EXTENSIONS: Record<string, string> = {
	'application/json': 'json',
	'application/pdf': 'pdf',
	'application/zip': 'zip',
	'image/png': 'png',
	'image/jpeg': 'jpg',
	'text/plain': 'txt',
	'text/html': 'html',
};

/** A download's filename: the object's own name, else the operation's. */
export function fileNameFor(
	// `unknown` because each operation's validated input has its own fields.
	input: Record<string, unknown>,
	contentType?: string | null,
): string {
	const object = input.object;
	if (typeof object === 'string') {
		const last = object
			.split('/')
			.pop()
			?.replace(/[^\w.-]/g, '_');
		if (last && last !== '.' && last !== '..') return last;
	}
	const type = (contentType ?? '').split(';')[0]?.trim().toLowerCase() ?? '';
	return `firebase-download${EXTENSIONS[type] ? `.${EXTENSIONS[type]}` : ''}`;
}

/**
 * One endpoint per manifest operation. The caller passes one flat object;
 * each named field goes to the path or query string as the spec says, and
 * everything else is the request body.
 */
export function createFirebaseOperation<Id extends FirebaseOperationId>(
	id: Id,
): FirebaseOperationEndpoint<Id> {
	return async (ctx, input) => {
		const operation = firebaseOperationFor(id);
		const parsedInput = getFirebaseInputSchema(id).safeParse(input ?? {});
		if (!parsedInput.success) {
			// Paths and messages only: zod's messages name what was expected, not the value sent.
			throw new Error(
				`Invalid input for firebase ${id}: ${describeIssues(id, parsedInput.error.issues, 'input', 5)}`,
			);
		}
		// `unknown` is necessary because the fields differ per operation; each was just validated.
		const valid: Record<string, unknown> = { ...parsedInput.data };

		const pathParameters: Record<string, string> = {};
		// `unknown` because query values are validated scalars or lists.
		const query: Record<string, unknown> = { ...(operation.forcedQuery ?? {}) };
		const headers: Record<string, string> = {};
		// `unknown` because body values are validated per operation.
		const body: Record<string, unknown> = {};
		// `unknown` because a whole-body value is any JSON or an upload.
		let bodyRoot: unknown;
		let hasBodyRoot = false;
		// `unknown` because an upload is a validated file input.
		let upload: unknown;
		let databaseUrl: string | undefined;
		const named = new Set<string>();
		for (const field of firebaseInputFields(id)) {
			named.add(field.name);
			const value = valid[field.name];
			if (field.in === 'bodyRoot' && field.name in valid) {
				// null is a real Realtime Database value (it deletes).
				bodyRoot = value;
				hasBodyRoot = true;
				continue;
			}
			if (value === undefined || value === null) continue;
			switch (field.in) {
				case 'path':
					pathParameters[field.wire] = encodeFirebasePathValue(
						String(value),
						field.slashes,
					);
					break;
				case 'query':
					query[field.wire] =
						operation.api === 'rtdb'
							? databaseQueryValue(field.wire, value)
							: value;
					break;
				case 'header':
					headers[field.wire] = String(value);
					break;
				case 'upload':
					upload = value;
					break;
				case 'databaseUrl':
					databaseUrl = String(value);
					break;
				default:
					body[field.wire] = value;
			}
		}
		// Keys the schema let through (objects keep unknown keys) go in the body.
		for (const [name, value] of Object.entries(valid)) {
			if (!named.has(name) && value !== undefined) body[name] = value;
		}

		// Which host: the API's own, an emulator, or the Realtime Database URL.
		const api = firebaseApis[operation.api];
		const emulatorUrls = ctx.options?.emulatorUrls ?? {};
		const emulated = api ? emulatorUrls[api.group] : undefined;
		let base = emulated ?? api?.baseUrl ?? '';
		let path = operation.path.replace(/\{\+/g, '{');
		if (operation.api === 'rtdb') {
			const url = realtimeDatabaseUrl(String(databaseUrl));
			if (emulated) {
				// The emulator serves every database on one host, picked by ?ns=.
				query.ns = url.hostname.split('.')[0];
			} else {
				base = url.origin;
			}
			if (!pathParameters.path) {
				path = path.replace('/{path}.json', '/.json');
			}
		}
		if (upload !== undefined && operation.uploadPath) {
			// Upload paths start at the host root (/upload/storage/v1/...).
			base = emulated ? new URL(emulated).origin : (api?.rootUrl ?? '');
			path = operation.uploadPath.replace(/\{\+/g, '{');
			query.uploadType = 'media';
		}

		const request: FirebaseRequest = {
			base,
			method: operation.method,
			path,
			pathParameters,
			query,
			headers,
			emulator: emulated !== undefined,
			// A route that may answer with no body is read as bytes: core turns
			// both an empty body and JSON it can't decode into `undefined`, and
			// only the second is an error.
			...(operation.response === 'empty'
				? { responseType: 'binary' as const }
				: {}),
		};
		if (upload !== undefined) {
			const resolved = await resolveFileInput(upload as FileInput, {
				maxBytes: FIREBASE_UPLOAD_MAX_BYTES,
				fallbackName: 'file',
			});
			request.body = new Blob([resolved.file], {
				type: resolved.file.type || 'application/octet-stream',
			});
			request.timeoutMs = FIREBASE_UPLOAD_TIMEOUT_MS;
		} else if (operation.request === 'json') {
			request.body = hasBodyRoot ? bodyRoot : body;
		}

		// `unknown` because the response is untrusted until the output schema parses it.
		let response: unknown;
		if (operation.response === 'file') {
			request.responseType = 'binary';
			const binary = await makeFirebaseRequest(ctx, request);
			if (!isBinaryResponse(binary))
				throw new Error('Firebase returned no file');
			response = toFileOutput(binary.bytes, binary.contentType, {
				filename: fileNameFor(parsedInput.data, binary.contentType),
			});
		} else if (operation.response === 'empty') {
			// Google answers `{}` (google.protobuf.Empty) or nothing; bytes that
			// aren't JSON point at something else (a proxy page) and throw.
			decodeMaybeEmpty(id, await makeFirebaseRequest(ctx, request));
			response = { success: true };
		} else {
			response = await makeFirebaseRequest(ctx, request);
			// Core resolves a 2xx whose JSON it can't decode as `undefined`:
			// that is a failure, never a result.
			if (response === undefined) {
				throw new Error(`Firebase ${id} returned no decodable JSON body`);
			}
		}

		// The output schema is built from the documented response; a body that
		// doesn't match it is an error, never replaced with a default.
		const parsedOutput = getFirebaseOutputSchema(id).safeParse(response);
		if (!parsedOutput.success) {
			throw new Error(
				`Firebase ${id} response did not match its documented schema: ${describeIssues(id, parsedOutput.error.issues, 'output', 3)}`,
			);
		}

		// Inputs and results hold documents, user records, messages and files:
		// log only which operation ran.
		await logEventFromContext(
			ctx,
			'firebase.operation',
			{ operationId: id },
			'completed',
		);
		return parsedOutput.data as FirebaseOperationOutputs[Id];
	};
}
