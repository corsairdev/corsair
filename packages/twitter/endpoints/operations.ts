import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { BinaryResponse, FileInput } from 'corsair/http';
import { resolveFileInput, toFileOutput } from 'corsair/http';
import type { XRequest } from '../client';
import { makeXRequest, X_UPLOAD_MAX_BYTES } from '../client';
import type { TwitterContext } from '../index';
import type { TwitterOperationDefinition } from './manifest';
import {
	getTwitterInputSchema,
	getTwitterOutputSchema,
	MASKED_KEY,
	maskedIssuePath,
	twitterInputFields,
	twitterOperationFor,
} from './openapi-schema';
import type {
	TwitterOperationId,
	TwitterOperationInputs,
	TwitterOperationOutputs,
} from './operation-types';

export type TwitterOperationEndpoint<Id extends TwitterOperationId> =
	CorsairEndpoint<
		TwitterContext,
		TwitterOperationInputs[Id],
		TwitterOperationOutputs[Id]
	>;

const SECOND = 1000;

/** Uploads and downloads move files; everything else answers in about a second. */
const SLOW_OPERATIONS = new Set<string>([
	'media.upload.single',
	'media.upload.append',
	'media.upload.finalize',
	'chat.media.appendUpload',
	'chat.media.download',
	'directMessages.media.download',
	'compliance.jobs.upload',
	'compliance.jobs.downloadResults',
	'posts.search.all',
	'posts.counts.all',
]);

export function timeoutFor(id: string): number {
	return SLOW_OPERATIONS.has(id) ? 120 * SECOND : 30 * SECOND;
}

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
										twitterInputFields(id)
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
 * Which kind of token the connection holds: `oauth_2` is a user's access
 * token, `api_key` is the app's Bearer token (app-only auth).
 */
export type XTokenKind = 'oauth_2' | 'api_key';

/**
 * X refuses a user token on app-only routes and an app token on user routes
 * (403 "Unsupported Authentication"), after the call is made. The manifest
 * records which one each route takes, so the mismatch is reported before
 * anything is sent.
 */
export function authProblem(
	operation: TwitterOperationDefinition,
	kind: XTokenKind,
): string | undefined {
	if (operation.auth === 'app' && kind === 'oauth_2') {
		return `X accepts only app-only auth on ${operation.id}: connect the X plugin with authType 'api_key' and the app's Bearer token (developer console → Keys and tokens).`;
	}
	if (operation.auth === 'user' && kind === 'api_key') {
		return `X needs a user's OAuth 2.0 token for ${operation.id}; the app's Bearer token can't act as a user. Connect with authType 'oauth_2'.`;
	}
	return undefined;
}

/** What to call a downloaded file, from the operation and the call's inputs. */
// `unknown` because each operation's validated input has its own fields.
export function fileNameFor(
	id: string,
	input: Record<string, unknown>,
): string {
	// `unknown` because each operation's validated input has its own field types.
	const text = (value: unknown, fallback: string) =>
		typeof value === 'string' && value.length > 0 ? value : fallback;
	switch (id) {
		case 'compliance.jobs.downloadResults':
			return `compliance-job-${text(input.id, 'results')}.json`;
		case 'directMessages.media.download':
			return text(input.media_id, 'dm-media');
		case 'chat.media.download':
			return text(input.media_hash_key, 'chat-media');
	}
	return 'file';
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

async function fileBytes(
	value: FileInput | Blob,
): Promise<{ blob: Blob; filename: string }> {
	const resolved = await resolveFileInput(value as FileInput, {
		maxBytes: X_UPLOAD_MAX_BYTES,
		fallbackName: 'file',
	});
	return { blob: resolved.file, filename: resolved.filename };
}

async function base64Of(value: FileInput | Blob): Promise<string> {
	const { blob } = await fileBytes(value);
	return Buffer.from(await blob.arrayBuffer()).toString('base64');
}

/**
 * One endpoint per manifest operation. The caller passes one flat object;
 * each named field goes to the path or the query string as the spec says, and
 * everything else is the JSON body.
 */
export function createTwitterOperation<Id extends TwitterOperationId>(
	id: Id,
): TwitterOperationEndpoint<Id> {
	return async (ctx, input) => {
		const operation = twitterOperationFor(id);
		const kind: XTokenKind =
			ctx.options?.authType === 'api_key' ? 'api_key' : 'oauth_2';
		const problem = authProblem(operation, kind);
		if (problem) throw new Error(problem);

		const parsedInput = getTwitterInputSchema(id).safeParse(input ?? {});
		if (!parsedInput.success) {
			// Paths and messages only: zod's messages name what was expected, not the value sent.
			throw new Error(
				`Invalid input for twitter ${id}: ${describeIssues(id, parsedInput.error.issues, 'input', 5)}`,
			);
		}
		// Send what was validated, not the caller's object.
		// `unknown` is necessary because the fields differ per operation; each was just validated.
		const valid: Record<string, unknown> = { ...parsedInput.data };

		const pathParameters: Record<string, string> = {};
		// `unknown` because query values are validated scalars or lists.
		const query: Record<string, unknown> = {};
		for (const field of twitterInputFields(id)) {
			if (field.in === 'body') {
				const value = valid[field.name];
				if (field.base64 && value !== undefined && value !== null) {
					// A file input (a URL, { url }, { base64 }, a Blob) goes out as base64.
					valid[field.name] = await base64Of(value as FileInput | Blob);
				}
				continue;
			}
			const value = valid[field.name];
			delete valid[field.name];
			if (value === undefined || value === null) continue;
			if (field.in === 'path') pathParameters[field.name] = String(value);
			else query[field.name] = value;
		}

		const request: XRequest = {
			key: ctx.key,
			method: operation.method,
			path: operation.path,
			pathParameters,
			query,
			timeoutMs: timeoutFor(id),
		};
		if (operation.request === 'json') {
			request.body = valid;
		} else if (operation.request === 'binary') {
			const file = valid.file;
			const { blob } = await fileBytes(file as FileInput | Blob);
			request.body = blob;
			request.mediaType = 'application/octet-stream';
		}

		// `unknown` because the response is untrusted until the output schema parses it.
		let response: unknown;
		if (operation.response === 'file') {
			request.responseType = 'binary';
			const binary = await makeXRequest(request);
			if (!isBinaryResponse(binary)) throw new Error('X returned no file');
			response = toFileOutput(binary.bytes, binary.contentType, {
				filename: fileNameFor(id, parsedInput.data),
			});
		} else {
			const body = await makeXRequest(request);
			response = operation.response === 'empty' ? { success: true } : body;
		}

		// The output schema is built from the documented response; a body that
		// doesn't match it is an error, never replaced with a default.
		const parsedOutput = getTwitterOutputSchema(id).safeParse(response);
		if (!parsedOutput.success) {
			throw new Error(
				`X ${id} response did not match its documented schema: ${describeIssues(id, parsedOutput.error.issues, 'output', 3)}`,
			);
		}

		// Inputs and results hold posts, DMs and user data: log only which operation ran.
		await logEventFromContext(
			ctx,
			'twitter.operation',
			{ operationId: id },
			'completed',
		);
		return parsedOutput.data as TwitterOperationOutputs[Id];
	};
}
