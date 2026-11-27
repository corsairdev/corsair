import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { BinaryResponse, FileInput } from 'corsair/http';
import { resolveFileInput, toFileOutput } from 'corsair/http';
import type { WordpressHttpMethod, WordpressRequest } from '../client';
import {
	encodeWordpressPathValue,
	makeWordpressRequest,
	WORDPRESS_UPLOAD_MAX_BYTES,
} from '../client';
import type { WordpressContext } from '../index';
import {
	getWordpressInputSchema,
	getWordpressOutputSchema,
	MASKED_KEY,
	maskedIssuePath,
	wordpressInputFields,
	wordpressOperationFor,
} from './openapi-schema';
import type {
	WordpressOperationId,
	WordpressOperationInputs,
	WordpressOperationOutputs,
} from './operation-types';

export type WordpressOperationEndpoint<Id extends WordpressOperationId> =
	CorsairEndpoint<
		WordpressContext,
		WordpressOperationInputs[Id],
		WordpressOperationOutputs[Id]
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
										wordpressInputFields(id)
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

/**
 * A query value as PHP reads it. core's transport writes a list as repeated
 * keys (`author=1&author=2`), and PHP keeps only the last one, so a list goes
 * out with indexes instead (`author[0]=1&author[1]=2`), which PHP reads as the
 * list. Objects already go out as `key[field]=value`. Booleans go out as
 * `true` / `false`, which WordPress's REST args read as booleans.
 */
// `unknown` because query values are validated scalars, lists and objects.
export function phpQueryValue(value: unknown): unknown {
	if (Array.isArray(value)) {
		return Object.fromEntries(
			value.map((item, index) => [String(index), phpQueryValue(item)]),
		);
	}
	if (typeof value === 'object' && value !== null) {
		return Object.fromEntries(
			Object.entries(value).map(([key, inner]) => [key, phpQueryValue(inner)]),
		);
	}
	return value;
}

/**
 * The page to ask for next. WordPress answers exactly `per_page` entries
 * while more remain (it sends the totals in X-WP-Total / X-WP-TotalPages,
 * which core doesn't return), so a full page may have a next one and a short
 * page is the last.
 */
// `unknown` because the input was validated against an open schema.
export function nextPageOf(
	input: Record<string, unknown>,
	count: number,
	defaultSize: number,
): number | null {
	const page =
		typeof input.page === 'number' && input.page > 0 ? input.page : 1;
	const size =
		typeof input.per_page === 'number' && input.per_page > 0
			? input.per_page
			: defaultSize;
	return count >= size && count > 0 ? page + 1 : null;
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

/** `Content-Disposition` for an upload, with the name WordPress saves the file under. */
export function contentDisposition(filename: string): string {
	const ascii = filename.replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '_');
	return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

/**
 * One endpoint per manifest operation. The caller passes one flat object;
 * each named field goes to the path or query string as the route says, and
 * everything else is the JSON body.
 */
export function createWordpressOperation<Id extends WordpressOperationId>(
	id: Id,
): WordpressOperationEndpoint<Id> {
	return async (ctx, input) => {
		const operation = wordpressOperationFor(id);
		const parsedInput = getWordpressInputSchema(id).safeParse(input ?? {});
		if (!parsedInput.success) {
			// Paths and messages only: zod's messages name what was expected, not the value sent.
			throw new Error(
				`Invalid input for wordpress ${id}: ${describeIssues(id, parsedInput.error.issues, 'input', 5)}`,
			);
		}
		// Send what was validated, not the caller's object.
		// `unknown` is necessary because the fields differ per operation; each was just validated.
		const valid: Record<string, unknown> = { ...parsedInput.data };

		const pathParameters: Record<string, string> = {};
		// `unknown` because query values are validated scalars, lists and objects.
		const query: Record<string, unknown> = {};
		// `unknown` because body values are validated per operation.
		const body: Record<string, unknown> = {};
		let method: WordpressHttpMethod = operation.method;
		const named = new Set<string>();
		for (const field of wordpressInputFields(id)) {
			named.add(field.name);
			const value = valid[field.name];
			if (value === undefined || value === null) continue;
			switch (field.in) {
				case 'path':
					pathParameters[field.wire] = encodeWordpressPathValue(
						String(value),
						field.slashes,
					);
					break;
				case 'query':
					query[field.wire] = phpQueryValue(value);
					break;
				case 'query-object':
					for (const [key, inner] of Object.entries(
						value as Record<string, unknown>,
					)) {
						if (inner !== undefined) query[key] = phpQueryValue(inner);
					}
					break;
				case 'body-object':
					Object.assign(body, value);
					break;
				case 'method':
					method = value as WordpressHttpMethod;
					break;
				default:
					body[field.wire] = value;
			}
		}
		// Keys the schema let through (objects keep unknown keys, such as a
		// custom field a plugin registers) go in the body.
		for (const [name, value] of Object.entries(valid)) {
			if (!named.has(name) && value !== undefined) body[name] = value;
		}

		const request: WordpressRequest = {
			method,
			path: operation.path,
			pathParameters,
			query,
		};
		if (operation.request === 'upload' && body.file !== undefined) {
			// The file is the body; every other field already went to the query.
			const resolved = await resolveFileInput(body.file as FileInput, {
				maxBytes: WORDPRESS_UPLOAD_MAX_BYTES,
				fallbackName: 'upload',
			});
			request.body = resolved.file;
			request.headers = {
				'Content-Disposition': contentDisposition(resolved.filename),
			};
		} else if (operation.request === 'upload') {
			// media.create with `url` and no file: WordPress sideloads the URL.
			request.body = {};
		} else if (
			operation.request === 'json' &&
			(method !== 'DELETE' || Object.keys(body).length > 0)
		) {
			request.body = body;
		}

		// `unknown` because the response is untrusted until the output schema parses it.
		let response: unknown;
		if (operation.response === 'file') {
			request.responseType = 'binary';
			const binary = await makeWordpressRequest(ctx, request);
			if (!isBinaryResponse(binary) || binary.bytes.byteLength === 0) {
				throw new Error(`WordPress ${id} answered without a file`);
			}
			if ((binary.contentType ?? '').toLowerCase().includes('html')) {
				throw new Error(`WordPress ${id} answered with a page, not a file`);
			}
			response = toFileOutput(binary.bytes, binary.contentType, {
				filename: `wordpress-${id.replace(/\./g, '-')}.zip`,
			});
		} else {
			const raw = await makeWordpressRequest(ctx, request);
			if (operation.paginated && Array.isArray(raw)) {
				response = {
					items: raw,
					next_page: nextPageOf(
						parsedInput.data,
						raw.length,
						operation.pageSize ?? 10,
					),
				};
			} else {
				response = raw;
			}
		}

		// The output schema is built from the route's own schema; a body that
		// doesn't match it is an error, never replaced with a default.
		const parsedOutput = getWordpressOutputSchema(id).safeParse(response);
		if (!parsedOutput.success) {
			throw new Error(
				`WordPress ${id} response did not match its documented schema: ${describeIssues(id, parsedOutput.error.issues, 'output', 3)}`,
			);
		}

		// Inputs and results hold drafts, user details and passwords: log only
		// which operation ran.
		await logEventFromContext(
			ctx,
			'wordpress.operation',
			{ operationId: id },
			'completed',
		);
		return parsedOutput.data as WordpressOperationOutputs[Id];
	};
}
