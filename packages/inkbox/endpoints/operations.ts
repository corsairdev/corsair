import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { BinaryResponse, FileInput } from 'corsair/http';
import { resolveFileInput, toFileOutput } from 'corsair/http';
import type { InkboxRequest } from '../client';
import { INKBOX_UPLOAD_MAX_BYTES, makeInkboxRequest } from '../client';
import type { InkboxContext } from '../index';
import type { InkboxOperationDefinition } from './manifest';
import {
	getInkboxInputSchema,
	getInkboxOutputSchema,
	inkboxInputFields,
	inkboxOperationFor,
	MASKED_KEY,
	maskedIssuePath,
} from './openapi-schema';
import type {
	InkboxOperationId,
	InkboxOperationInputs,
	InkboxOperationOutputs,
} from './operation-types';

export type InkboxOperationEndpoint<Id extends InkboxOperationId> =
	CorsairEndpoint<
		InkboxContext,
		InkboxOperationInputs[Id],
		InkboxOperationOutputs[Id]
	>;

const SECOND = 1000;

/**
 * Calls that wait on something slow: a hosted agent's turn, a tool it runs, a
 * phone call being placed, a file upload, a Slack archive backfill. Everything
 * else answers in about a second.
 */
const SLOW_OPERATIONS = new Set<string>([
	'hostedChat.turns.create',
	'hosting.callTool',
	'phone.calls.place',
	'phone.numbers.provision',
	'imessage.uploadMedia',
	'whatsapp.media.upload',
	'identities.avatar.upload',
	'compliance.uploadOptInEvidence',
	'hostedChat.files.upload',
	'slack.files.upload',
	'slack.archive.backfill',
	'mail.messages.send',
	'mail.drafts.send',
	'contacts.import',
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
										inkboxInputFields(id)
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

/** Top-level body fields that hold a file (`file` on every Inkbox upload route). */
export function fileFields(operation: InkboxOperationDefinition): Set<string> {
	const names = new Set<string>();
	const properties = operation.input.properties;
	if (typeof properties !== 'object' || properties === null) return names;
	for (const [name, schema] of Object.entries(properties)) {
		if (
			typeof schema === 'object' &&
			schema !== null &&
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
	operation: InkboxOperationDefinition,
	// `unknown` because the body fields are validated per operation.
	body: Record<string, unknown>,
): Promise<FormData> {
	const files = fileFields(operation);
	const form = new FormData();
	for (const [name, value] of Object.entries(body)) {
		if (value === undefined || value === null) continue;
		if (files.has(name) && (isFileValue(value) || typeof value === 'string')) {
			const resolved = await resolveFileInput(value as FileInput, {
				maxBytes: INKBOX_UPLOAD_MAX_BYTES,
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

/** What to call a downloaded file, from the operation and the call's inputs. */
// `unknown` because each operation's validated input has its own fields.
export function fileNameFor(
	id: string,
	input: Record<string, unknown>,
	contentType?: string | null,
): string {
	const text = (value: unknown, fallback: string) =>
		typeof value === 'string' && value.length > 0 ? value : fallback;
	const image = (contentType ?? '').toLowerCase().includes('png')
		? 'png'
		: (contentType ?? '').toLowerCase().includes('webp')
			? 'webp'
			: 'jpg';
	switch (id) {
		case 'contacts.exportVcard':
			return `${text(input.contact_id, 'contact')}.vcf`;
		case 'identities.avatar.get':
			return `${text(input.agent_handle, 'identity')}-avatar.jpg`;
		case 'imessage.router.getAvatar':
			return `imessage-router-avatar.${image}`;
		case 'phone.media.getPlayback':
		case 'imessage.getMediaPlayback':
		case 'whatsapp.media.getPlayback':
			return `${text(input.media_id, 'audio')}.wav`;
		case 'slack.files.getPreview':
			return `${text(input.file_id, 'file')}-preview.${image}`;
		case 'slack.getCachedMedia':
			return `${text(input.kind, 'media')}-${text(input.resource_id, 'image')}.${image}`;
		case 'slack.files.download':
			return text(input.file_id, 'file');
		case 'mail.drafts.getAttachment':
			return `attachment-${String(input.part_index ?? 'file')}`;
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

/**
 * One endpoint per manifest operation. The caller passes one flat object;
 * each named field goes to the path, query string or a header as the spec
 * says, and everything else is the request body.
 */
export function createInkboxOperation<Id extends InkboxOperationId>(
	id: Id,
): InkboxOperationEndpoint<Id> {
	return async (ctx, input) => {
		const operation = inkboxOperationFor(id);
		const parsedInput = getInkboxInputSchema(id).safeParse(input ?? {});
		if (!parsedInput.success) {
			// Paths and messages only: zod's messages name what was expected, not the value sent.
			throw new Error(
				`Invalid input for inkbox ${id}: ${describeIssues(id, parsedInput.error.issues, 'input', 5)}`,
			);
		}
		// Send what was validated, not the caller's object.
		// `unknown` is necessary because the fields differ per operation; each was just validated.
		const valid: Record<string, unknown> = { ...parsedInput.data };

		const pathParameters: Record<string, string> = {};
		// `unknown` because query values are validated scalars or lists.
		const query: Record<string, unknown> = { ...(operation.fixedQuery ?? {}) };
		const headers: Record<string, string> = {};
		for (const field of inkboxInputFields(id)) {
			if (field.in === 'body') continue;
			let value = valid[field.name];
			delete valid[field.name];
			if (field.generated && (value === undefined || value === '')) {
				// One key per call: core's 429 retries resend the same headers, so a
				// retried send can't go out twice.
				value = crypto.randomUUID();
			}
			if (value === undefined || value === null) continue;
			switch (field.in) {
				case 'path':
					pathParameters[field.name] = String(value);
					break;
				case 'header':
					headers[field.header ?? field.name] = String(value);
					break;
				case 'query':
					query[field.name] = value;
					break;
			}
		}

		const request: InkboxRequest = {
			key: ctx.key,
			method: operation.method,
			path: operation.path,
			pathParameters,
			query,
			headers,
			timeoutMs: timeoutFor(id),
		};
		// Fields Inkbox sets itself never go back, even when the caller passes an object it read.
		for (const name of operation.serverSetFields ?? []) delete valid[name];
		if (operation.request === 'json') request.body = valid;
		else if (operation.request === 'multipart') {
			request.body = await buildForm(operation, valid);
		} else if (operation.request === 'text') {
			// The one body field left is the raw text (contacts.import's vCard).
			const [text] = Object.values(valid);
			request.body = typeof text === 'string' ? text : '';
			request.mediaType = operation.bodyMediaType;
		}

		// `unknown` because the response is untrusted until the output schema parses it.
		let response: unknown;
		if (operation.response === 'file') {
			request.responseType = 'binary';
			const binary = await makeInkboxRequest(request);
			if (!isBinaryResponse(binary)) throw new Error('Inkbox returned no file');
			response = toFileOutput(binary.bytes, binary.contentType, {
				filename: fileNameFor(id, parsedInput.data, binary.contentType),
			});
		} else {
			const body = await makeInkboxRequest(request);
			response = operation.response === 'empty' ? { success: true } : body;
		}

		// The output schema is built from the documented response; a body that
		// doesn't match it is an error, never replaced with a default.
		const parsedOutput = getInkboxOutputSchema(id).safeParse(response);
		if (!parsedOutput.success) {
			throw new Error(
				`Inkbox ${id} response did not match its documented schema: ${describeIssues(id, parsedOutput.error.issues, 'output', 3)}`,
			);
		}

		// Inputs and results hold messages, phone numbers, contacts and vault
		// ciphertext: log only which operation ran.
		await logEventFromContext(
			ctx,
			'inkbox.operation',
			{ operationId: id },
			'completed',
		);
		return parsedOutput.data as InkboxOperationOutputs[Id];
	};
}
