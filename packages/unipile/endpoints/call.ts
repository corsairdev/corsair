import type { CorsairEndpoint } from 'corsair/core';
import type { z } from 'zod';
import type { UnipileContext } from '..';
import type { UnipileQuery, UnipileRequest } from '../client';
import { makeUnipileFileRequest, makeUnipileRequest, segment } from '../client';
import { logCompleted } from '../log-event';
import { DEFAULT_MAX_FILE_BYTES } from './schemas/shared';
import type {
	UnipileEndpointInputs,
	UnipileEndpointOutputs,
	UnipileOperation,
	UnipileUnparsedWriteResponse,
} from './types';
import {
	UNIPILE_WRITE_OPERATIONS,
	UnipileEndpointInputSchemas,
	UnipileEndpointOutputSchemas,
} from './types';

const WRITE_OPERATIONS: ReadonlySet<UnipileOperation> = new Set(
	UNIPILE_WRITE_OPERATIONS,
);

/** An operation's input after its schema ran (defaults filled in). */
export type ParsedInput<K extends UnipileOperation> = z.output<
	(typeof UnipileEndpointInputSchemas)[K]
>;

/** `/v2/{account_id}` plus the rest of a per-account route. */
export function accountPath(accountId: string, rest: string): string {
	return `/v2/${segment(accountId)}${rest}`;
}

// Only identifiers are logged. Message text, invitation notes, names and
// profile data stay out of the event log.
const LOGGED_INPUT_KEYS = [
	'account_id',
	'chat_id',
	'request_id',
	'post_id',
	'id',
	'type',
] as const;

// unknown: inputs and results differ per operation; only string ids and the
// size of a `data` page are read from them.
function logFields(
	parsed: Record<string, unknown>,
	result: Record<string, unknown>,
): Record<string, string | number> {
	const fields: Record<string, string | number> = {};
	for (const key of LOGGED_INPUT_KEYS) {
		const value = parsed[key];
		if (typeof value === 'string') fields[key] = value;
	}
	if (Array.isArray(result.data)) fields.items = result.data.length;
	if (typeof result.id === 'string') fields.result_id = result.id;
	if (typeof result.chat_id === 'string') fields.chat_id = result.chat_id;
	if (typeof result.message_id === 'string') {
		fields.message_id = result.message_id;
	}
	if (typeof result.parse_warning === 'string') fields.unparsed_response = 1;
	return fields;
}

// unknown: an endpoint result, which is usually but not always an object.
function asRecord(value: unknown): Record<string, unknown> {
	return value !== null && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: {};
}

function unparsedWrite(
	event: string,
	error: z.ZodError,
	// unknown: the 2xx body that failed the output schema.
	body: unknown,
): UnipileUnparsedWriteResponse {
	const issues = error.issues
		.slice(0, 3)
		.map((issue) => `${issue.path.join('.') || '(body)'}: ${issue.message}`)
		.join('; ');
	const parse_warning = `Unipile accepted ${event} but its response did not match the expected shape (${issues}). The action already happened; do not resend it.`;
	console.warn(`[corsair:unipile] ${parse_warning}`);
	return { parse_warning, raw: body };
}

/**
 * Validates the input, sends one request, validates the response and logs the
 * ids involved. Retries are decided by error-handlers.ts, never here.
 *
 * Once Unipile has answered 2xx to a write, the invitation or message has
 * gone out, so nothing after that point may throw: a response that fails the
 * output schema comes back as `{ parse_warning, raw }`, and logging errors are
 * swallowed. Either would otherwise look like a failure and invite a resend.
 */
export async function call<K extends UnipileOperation>(
	ctx: UnipileContext,
	operation: K,
	event: string,
	// unknown: raw caller input, parsed below by the operation's input schema.
	input: unknown,
	toRequest: (parsed: ParsedInput<K>) => UnipileRequest,
	// unknown: the raw response body, before the output schema parses it.
	// Output schemas are loose, so fields that must not reach the caller
	// (such as a signing secret) are removed here rather than by the schema.
	prepare: (raw: unknown) => unknown = (raw) => raw,
): Promise<UnipileEndpointOutputs[K]> {
	// Indexing the schema map with a generic key yields the union of every
	// schema; the cast restores the one `operation` names.
	const parsed = UnipileEndpointInputSchemas[operation].parse(
		input ?? {},
	) as ParsedInput<K>;
	const body = prepare(await makeUnipileRequest(ctx.key, toRequest(parsed)));
	const checked = UnipileEndpointOutputSchemas[operation].safeParse(body);

	let result: UnipileEndpointOutputs[K];
	if (checked.success) {
		// Same generic-index widening as the input parse above.
		result = checked.data as UnipileEndpointOutputs[K];
	} else if (WRITE_OPERATIONS.has(operation)) {
		// K is a write operation here, whose output type includes this shape.
		result = unparsedWrite(
			event,
			checked.error,
			body,
		) as UnipileEndpointOutputs[K];
	} else {
		throw checked.error;
	}

	await logCompleted(
		ctx,
		`unipile.${event}`,
		// Every input schema is a z.object; outputs are objects except
		// linkedin.request, which asRecord turns into an empty record.
		logFields(parsed as Record<string, unknown>, asRecord(result)),
	);
	return result;
}

/** How a generated operation maps its flat input onto the HTTP request. */
export type RouteSpec = {
	method: UnipileRequest['method'];
	/** Path template; `{name}` is filled from the input and URL-encoded. */
	path: string;
	/** Input keys sent as query parameters. */
	query?: readonly string[];
	/** Input keys sent in the JSON body, or 'rest' for every other key. */
	body?: readonly string[] | 'rest';
	/** Input key -> wire name, where a body field clashes with a path one. */
	rename?: Readonly<Record<string, string>>;
};

export function routeRequest(
	// unknown: a parsed input; its schema already validated every value.
	parsed: Record<string, unknown>,
	spec: RouteSpec,
): UnipileRequest {
	const used = new Set<string>();
	const path = spec.path.replace(/\{(\w+)\}/g, (_match, name: string) => {
		used.add(name);
		const value = parsed[name];
		if (typeof value !== 'string' && typeof value !== 'number') {
			throw new Error(`Missing path parameter ${name}`);
		}
		return segment(String(value));
	});

	let query: UnipileQuery | undefined;
	for (const key of spec.query ?? []) {
		used.add(key);
		if (parsed[key] === undefined) continue;
		query ??= {};
		query[key] = parsed[key];
	}

	let body: Record<string, unknown> | undefined;
	if (spec.body) {
		body = {};
		const keys =
			spec.body === 'rest'
				? Object.keys(parsed).filter((key) => !used.has(key))
				: spec.body;
		for (const key of keys) {
			if (parsed[key] === undefined) continue;
			body[spec.rename?.[key] ?? key] = parsed[key];
		}
	}

	return { method: spec.method, path, query, body };
}

type Endpoint<K extends UnipileOperation> = CorsairEndpoint<
	UnipileContext,
	UnipileEndpointInputs[K],
	UnipileEndpointOutputs[K]
>;

/** An endpoint whose request is fully described by `spec`. */
export function defineOperation<K extends UnipileOperation>(
	operation: K,
	event: string,
	spec: RouteSpec,
	// unknown: see call().
	prepare?: (raw: unknown) => unknown,
): Endpoint<K> {
	return (ctx, input) =>
		call(
			ctx,
			operation,
			event,
			input,
			// Every input schema is a z.object, so the parsed input is a record.
			(parsed) => routeRequest(parsed as Record<string, unknown>, spec),
			prepare,
		);
}

function toBase64(bytes: Uint8Array): string {
	return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString(
		'base64',
	);
}

/**
 * A GET that returns a file. Only its type and size come back unless the
 * caller sets include_content, and never more than max_bytes of it.
 */
export function defineBinaryOperation<K extends UnipileOperation>(
	operation: K,
	event: string,
	spec: RouteSpec,
): Endpoint<K> {
	return async (ctx, input) => {
		// Same generic-index widening as in call().
		const parsed = UnipileEndpointInputSchemas[operation].parse(
			input ?? {},
		) as Record<string, unknown> & {
			include_content?: boolean;
			max_bytes?: number;
		};
		const { path } = routeRequest(parsed, spec);
		const maxBytes = parsed.max_bytes ?? DEFAULT_MAX_FILE_BYTES;
		const file = await makeUnipileFileRequest(ctx.key, path, maxBytes);
		const include = parsed.include_content === true;
		const body: Record<string, string | number> = {
			content_type: file.contentType,
			size_bytes: file.sizeBytes,
		};
		if (file.filename) body.filename = file.filename;
		if (include && file.bytes) body.content_base64 = toBase64(file.bytes);
		if (include && !file.bytes) {
			body.content_omitted = `File is ${file.sizeBytes} bytes, over max_bytes (${maxBytes})`;
		}
		const result = UnipileEndpointOutputSchemas[operation].parse(
			body,
		) as UnipileEndpointOutputs[K];
		await logCompleted(ctx, `unipile.${event}`, {
			...logFields(parsed, {}),
			size_bytes: file.sizeBytes,
		});
		return result;
	};
}

/** For 204 routes: an empty body means the action succeeded. */
// unknown: the raw body, which is empty on a 204.
export function noContent(raw: unknown): unknown {
	return raw === undefined || raw === null || raw === ''
		? { success: true }
		: raw;
}
