import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { BinaryResponse } from 'corsair/http';
import { toFileOutput } from 'corsair/http';
import type { MongoDBAtlasRequest } from '../client';
import {
	encodeMongoDBAtlasPathValue,
	MONGODBATLAS_PAGE_SIZE,
	makeMongoDBAtlasRequest,
} from '../client';
import type { MongoDBAtlasContext } from '../index';
import {
	getMongoDBAtlasInputSchema,
	getMongoDBAtlasOutputSchema,
	MASKED_KEY,
	maskedIssuePath,
	mongodbatlasInputFields,
	mongodbatlasOperationFor,
} from './openapi-schema';
import type {
	MongoDBAtlasOperationId,
	MongoDBAtlasOperationInputs,
	MongoDBAtlasOperationOutputs,
} from './operation-types';

export type MongoDBAtlasOperationEndpoint<Id extends MongoDBAtlasOperationId> =
	CorsairEndpoint<
		MongoDBAtlasContext,
		MongoDBAtlasOperationInputs[Id],
		MongoDBAtlasOperationOutputs[Id]
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
										mongodbatlasInputFields(id)
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
		throw new Error(`MongoDBAtlas ${id} answered with a body that is not JSON`);
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

/** File extensions for the content types Atlas downloads come back as. */
const EXTENSIONS: Record<string, string> = {
	'application/gzip': 'gz',
	'application/x-gzip': 'gz',
	'text/csv': 'csv',
};

/** A download's filename: the operation and its record (`clusterName`, `invoiceId`). */
export function fileNameFor(
	id: string,
	// `unknown` because each operation's validated input has its own fields.
	input: Record<string, unknown>,
	contentType?: string | null,
): string {
	const record =
		input.invoiceId ?? input.hostName ?? input.clusterName ?? input.logName;
	const ref =
		typeof record === 'string' && record
			? `-${record.replace(/[^\w.-]/g, '_')}`
			: '';
	const type = (contentType ?? '').split(';')[0]?.trim().toLowerCase() ?? '';
	const ext =
		EXTENSIONS[type] ??
		(type.includes('gzip') ? 'gz' : type.includes('csv') ? 'csv' : '');
	return `atlas-${id.replace(/\./g, '-')}${ref}${ext ? `.${ext}` : ''}`;
}

/**
 * One endpoint per manifest operation. The caller passes one flat object;
 * each named field goes to the path, query or a header as the spec says, and
 * everything else is the request body. Every call carries the operation's
 * pinned media type (`application/vnd.atlas.2025-03-12+json`).
 */
export function createMongoDBAtlasOperation<Id extends MongoDBAtlasOperationId>(
	id: Id,
): MongoDBAtlasOperationEndpoint<Id> {
	return async (ctx, input) => {
		const operation = mongodbatlasOperationFor(id);
		const parsedInput = getMongoDBAtlasInputSchema(id).safeParse(input ?? {});
		if (!parsedInput.success) {
			// Paths and messages only: zod's messages name what was expected, not the value sent.
			throw new Error(
				`Invalid input for mongodbatlas ${id}: ${describeIssues(id, parsedInput.error.issues, 'input', 5)}`,
			);
		}
		// `unknown` is necessary because the fields differ per operation; each was just validated.
		const valid: Record<string, unknown> = { ...parsedInput.data };

		const pathParameters: Record<string, string> = {};
		// `unknown` because query values are validated scalars or lists.
		const query: Record<string, unknown> = {};
		const headers: Record<string, string> = { Accept: operation.accept };
		// `unknown` because body values are validated per operation.
		const body: Record<string, unknown> = {};
		// `unknown` because a whole-body value is a list or one of several shapes.
		let bodyRoot: unknown;
		const named = new Set<string>();
		for (const field of mongodbatlasInputFields(id)) {
			named.add(field.name);
			const value = valid[field.name];
			if (value === undefined || value === null) continue;
			switch (field.in) {
				case 'path':
					pathParameters[field.wire] = encodeMongoDBAtlasPathValue(
						String(value),
						field.slashes,
					);
					break;
				case 'query':
					query[field.wire] = value;
					break;
				case 'header':
					headers[field.wire] = String(value);
					break;
				case 'bodyRoot':
					bodyRoot = value;
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
		if (operation.paged && query.itemsPerPage === undefined) {
			// Atlas's default page is 100 for most lists, but not all.
			query.itemsPerPage = MONGODBATLAS_PAGE_SIZE;
		}

		const request: MongoDBAtlasRequest = {
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
		if (operation.request === 'json') {
			request.body = bodyRoot !== undefined ? bodyRoot : body;
			// The body goes in the same version as the Accept header.
			request.mediaType = operation.accept.replace(/\+(csv|gzip)$/, '+json');
		}

		// `unknown` because the response is untrusted until the output schema parses it.
		let response: unknown;
		if (operation.response === 'file') {
			request.responseType = 'binary';
			const binary = await makeMongoDBAtlasRequest(ctx, request);
			if (!isBinaryResponse(binary)) throw new Error('Atlas returned no file');
			response = toFileOutput(binary.bytes, binary.contentType, {
				filename: fileNameFor(id, parsedInput.data, binary.contentType),
			});
		} else if (operation.response === 'empty') {
			// No body documented: the 2xx is the answer. Bytes that aren't JSON
			// point at something else (a proxy page) and throw.
			decodeMaybeEmpty(id, await makeMongoDBAtlasRequest(ctx, request));
			response = { success: true };
		} else {
			let raw = await makeMongoDBAtlasRequest(ctx, request);
			if (operation.emptyOk) raw = decodeMaybeEmpty(id, raw);
			else if (raw === undefined) {
				// Core resolves a 2xx whose JSON it can't decode as `undefined`.
				throw new Error(`MongoDB Atlas ${id} returned no decodable JSON body`);
			}
			response = raw === EMPTY ? { success: true } : raw;
		}

		// The output schema is built from the documented response; a body that
		// doesn't match it is an error, never replaced with a default.
		const parsedOutput = getMongoDBAtlasOutputSchema(id).safeParse(response);
		if (!parsedOutput.success) {
			throw new Error(
				`MongoDB Atlas ${id} response did not match its documented schema: ${describeIssues(id, parsedOutput.error.issues, 'output', 3)}`,
			);
		}

		// Inputs and results hold connection strings, users, IP lists and
		// invoices: log only which operation ran.
		await logEventFromContext(
			ctx,
			'mongodbatlas.operation',
			{ operationId: id },
			'completed',
		);
		return parsedOutput.data as MongoDBAtlasOperationOutputs[Id];
	};
}
