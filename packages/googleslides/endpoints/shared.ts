import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { GoogleSlidesContext } from '..';
import type { ProviderJson } from '../types';

export type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Runs one operation: validate the input, send the request, shape and validate
 * the reply, then log. Every endpoint goes through here so the input parse
 * cannot be forgotten and a caller never receives unparsed JSON.
 *
 * `shape` runs after the request and before the output parse, which is where a
 * derived field belongs: the docs generator reads a schema's input side, so a
 * field added by `.transform()` would be invisible in the API reference while
 * callers still received it.
 */
export async function call<Input, Output>(
	ctx: GoogleSlidesContext,
	operation: {
		/** Telemetry label, e.g. presentations.create */
		event: string;
		input: z.ZodType<Input>;
		output: z.ZodType<Output>;
	},
	rawInput: unknown, // unknown: caller input; the zod schema defines its shape.
	run: (parsed: Input) => Promise<unknown>, // unknown: reply; output schema validates it.
	log?: (parsed: Input, result: Output) => LogFields,
	options: {
		shape?: (raw: unknown, parsed: Input) => unknown; // unknown: output schema validates it.
	} = {},
): Promise<Output> {
	const parsed = operation.input.parse(rawInput ?? {});
	// Checked before the request, not after: logEventFromContext seals the
	// payload with the account key when encryption at rest is on, and it throws
	// when the key is missing. Raised after a write, that failure would report a
	// completed write as a failure and invite a retry that repeats it.
	assertEncryptionConfigured(ctx);
	const raw = await run(parsed);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`googleslides.${operation.event}`,
		log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Refuses a request that would succeed at Google and then fail while logging.
 * `logEventFromContext` throws `encryptDataAtRest requires kek` when encryption
 * is on and no key is set, so the check runs before the request leaves.
 */
function assertEncryptionConfigured(ctx: GoogleSlidesContext): void {
	const encrypting = (ctx as { encryptDataAtRest?: boolean }).encryptDataAtRest;
	const kek = (ctx as { kek?: string }).kek;
	if (encrypting === true && !kek) {
		throw new Error(
			'encryptDataAtRest is enabled but no kek is configured, so the request would succeed and the event log would fail. Set a kek before calling this endpoint.',
		);
	}
}

/**
 * A reply slot exists per request and may be an empty object. Replies and
 * requests are positional, so reading the first non-empty slot would attribute
 * one operation's reply to another.
 *
 * The API's Reply union has a key per request type, so a caller narrows each
 * slot itself; the entry is therefore an object of ProviderJson values.
 */
export function replyAt(
	replies: unknown[] | undefined, // unknown: one entry per request; keys vary by request.
	index: number,
): ProviderJson | undefined {
	const entry = replies?.[index];
	return entry && typeof entry === 'object'
		? (entry as ProviderJson)
		: undefined;
}

/**
 * Drops keys whose value is undefined so an omitted input never reaches the
 * body. The values stay untyped here because each request body mixes strings,
 * numbers, nested objects and arrays, all of which googleApiRequest JSON-encodes.
 */
export function compact(value: ProviderJson): ProviderJson {
	const out: ProviderJson = {};
	for (const [key, entry] of Object.entries(value)) {
		if (entry !== undefined) out[key] = entry;
	}
	return out;
}

export type QueryValue = string | number | boolean | undefined;

/** Drops undefined query parameters, which corsair/http would otherwise encode. */
export function compactQuery(
	value: Record<string, QueryValue>,
): Record<string, QueryValue> {
	const out: Record<string, QueryValue> = {};
	for (const [key, entry] of Object.entries(value)) {
		if (entry !== undefined) out[key] = entry;
	}
	return out;
}
