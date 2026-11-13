import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { RollbarContext } from '..';
import type { RollbarRequest } from '../client';
import { makeRollbarRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Item titles and occurrence payloads carry application
 * data, so `log` records ids and counts rather than text.
 *
 * The client already turns a non-zero `err` into an error, so a value that
 * reaches the output schema is a genuine success envelope.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: RollbarContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => Omit<RollbarRequest, 'checkErr'>,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeRollbarRequest(ctx.key, {
		...toRequest(parsed),
		// Every route on this API answers `{ err }`, so the check always applies.
		checkErr: true,
	});
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`rollbar.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Drops unset query values so an absent filter is not serialised. Rollbar reads
 * `status` and `level` as repeatable filters, so an empty value is a different
 * query. A `null` is kept: in a PATCH body it clears a field.
 */
export function queryOf<
	V extends string | number | boolean | null | (string | number)[],
>(values: Record<string, V | undefined>): Record<string, V> {
	const kept = Object.entries(values).filter(
		(entry): entry is [string, V] => entry[1] !== undefined,
	);
	return Object.fromEntries(kept);
}
