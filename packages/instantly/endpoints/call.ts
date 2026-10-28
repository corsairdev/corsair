import { asRecord, logEventFromContext } from 'corsair/core';
import type { ZodError } from 'zod';
import type { InstantlyContext } from '..';
import type { InstantlyRequest } from '../client';
import { makeInstantlyRequest } from '../client';
import { withReadRetries } from '../error-handlers';
import type {
	InstantlyEndpointOutputs,
	InstantlyOperation,
	InstantlyParsedInputs,
	InstantlyVerifiedOutputs,
	UnverifiedWriteResult,
} from './types';
import {
	INSTANTLY_WRITE_OPERATIONS,
	InstantlyEndpointInputSchemas,
	InstantlyEndpointOutputSchemas,
} from './types';

type LogFields = Record<string, string | number | boolean | null | undefined>;

/** Logging never fails a call: the Instantly side already happened. */
export async function safeLog(
	ctx: InstantlyContext,
	event: string,
	fields: () => LogFields,
): Promise<void> {
	try {
		await logEventFromContext(ctx, event, fields(), 'completed');
	} catch (error) {
		console.warn(`Failed to log ${event}:`, error);
	}
}

function summarize(error: ZodError): string {
	return error.issues
		.slice(0, 3)
		.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
		.join('; ');
}

// unknown: the response body that failed its schema.
function unverified(raw: unknown, error: ZodError): UnverifiedWriteResult {
	return {
		...(asRecord(raw) ?? { body: raw }),
		parse_warning: `Instantly accepted the request, but its response did not match the expected shape (${summarize(error)}). The change was made: do not repeat it.`,
	};
}

/**
 * Validates the input, sends the request, validates the response and logs
 * the call. Reads are retried (see withReadRetries); writes are sent once.
 * A write whose response fails its schema returns the raw body with a
 * parse_warning instead of throwing. Only IDs and counts are logged: inputs
 * and results hold lead names, addresses and email bodies.
 */
export async function call<K extends InstantlyOperation>(
	ctx: InstantlyContext,
	operation: K,
	event: string,
	// unknown: raw caller input, parsed below by the operation's input schema.
	input: unknown,
	toRequest: (parsed: InstantlyParsedInputs[K]) => InstantlyRequest,
	options: {
		log?: (
			parsed: InstantlyParsedInputs[K],
			result: InstantlyVerifiedOutputs[K],
		) => LogFields;
		after?: (
			result: InstantlyVerifiedOutputs[K],
			parsed: InstantlyParsedInputs[K],
		) => Promise<void>;
	} = {},
): Promise<InstantlyEndpointOutputs[K]> {
	// The schema maps are indexed by a generic key, which TypeScript cannot
	// narrow to the matching schema; parse() returns that schema's type.
	const parsed = InstantlyEndpointInputSchemas[operation].parse(
		input ?? {},
	) as InstantlyParsedInputs[K];
	const request = toRequest(parsed);
	const isWrite = INSTANTLY_WRITE_OPERATIONS.has(operation);
	const send = () => makeInstantlyRequest(ctx.key, request);
	const answer = isWrite ? await send() : await withReadRetries(send, event);
	// A 204 (share, delete) has no body; treat it as an empty object.
	const raw = answer === undefined ? {} : answer;

	const checked = InstantlyEndpointOutputSchemas[operation].safeParse(raw);
	if (!checked.success) {
		// A read can simply be called again, so a bad shape is an error.
		if (!isWrite) throw checked.error;
		await safeLog(ctx, `instantly.${event}`, () => ({ parseWarning: true }));
		// Same generic-key limit as above: every write's output schema is a
		// union that includes UnverifiedWriteResult.
		return unverified(raw, checked.error) as InstantlyEndpointOutputs[K];
	}
	// A body that itself carries parse_warning matched the unverified branch.
	if (isWrite && 'parse_warning' in (asRecord(checked.data) ?? {})) {
		await safeLog(ctx, `instantly.${event}`, () => ({ parseWarning: true }));
		return checked.data as InstantlyEndpointOutputs[K];
	}

	// Same generic-key limit; parse_warning results were returned above.
	const result = checked.data as InstantlyVerifiedOutputs[K];
	try {
		await options.after?.(result, parsed);
	} catch (error) {
		console.warn(`Failed to store the result of ${event}:`, error);
	}
	await safeLog(
		ctx,
		`instantly.${event}`,
		() => options.log?.(parsed, result) ?? {},
	);
	return result;
}
