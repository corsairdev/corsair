import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { KnackContext } from '..';
import type { KnackCredentials, KnackRequest } from '../client';
import { makeKnackRequest, parseKnackCredentials } from '../client';
import type { KnackRecord } from './types';
import { KnackRecordListSchema, KnackRecordSchema } from './types';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * `ctx.key` is the packed credential pair, so an endpoint reads it back before
 * the request. A key that will not unpack means the account has no usable pair,
 * which is a missing-auth case rather than a malformed request.
 */
export function requireKnackCredentials(key: string): KnackCredentials {
	const credentials = parseKnackCredentials(key);
	if (!credentials) throw new AuthMissingError('knack', 'api_key');
	return credentials;
}

/**
 * Validates the input, sends the request, validates the answer, then logs the
 * event. Raw input is not logged: a record body is the caller's business data,
 * and `log` picks the fields that are safe to keep.
 */
export async function callKnack<
	Input extends z.ZodType,
	Output extends z.ZodType,
>(
	ctx: KnackContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => KnackRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns, and a shape that a provider answers without one uses it.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeKnackRequest(
		requireKnackCredentials(ctx.key),
		toRequest(parsed),
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`knack.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Knack answers a missing record with `200` and an empty records list rather
 * than a 404, and a present one as a bare record object. Both shapes come back
 * from the same route, so this accepts either and raises on the empty list.
 */
// unknown: the body is unparsed until the schema below reads it, because the
// route answers two different shapes for the same request.
export function resolveSingleRecord(
	raw: unknown,
	context: string,
): KnackRecord {
	if (!KnackRecordListSchema.safeParse(raw).success) {
		// A present record: the bare object the route returns.
		const record = KnackRecordSchema.safeParse(raw);
		if (record.success) return record.data;
		throw new Error(
			`Knack ${context} answered with neither a record nor a records list.`,
		);
	}

	const list = KnackRecordListSchema.parse(raw);
	const record = list.records[0];
	if (!record) {
		throw new Error(
			`Knack ${context} returned no record. An id that does not exist answers an empty list rather than a 404.`,
		);
	}
	return record;
}
