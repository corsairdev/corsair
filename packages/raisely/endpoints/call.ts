import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { RaiselyContext } from '..';
import type { RaiselyRequest } from '../client';
import { makeRaiselyRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Donor names, emails and messages are personal data, so
 * `log` records ids and counts rather than free text.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: RaiselyContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => RaiselyRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeRaiselyRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`raisely.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * One value in a custom-fields map: a scalar, a list of scalars, or a nested map
 * of scalars.
 */
export type RaiselyCustomValue =
	| string
	| number
	| boolean
	| null
	| undefined
	| Array<string | number | boolean>
	| Record<string, string | number | boolean | null | undefined>;

/**
 * A query value, or a custom-values map carried in a request body. The account's
 * own `public`, `private` and `config` maps go through the same helper, and a
 * theme setting nests, so a map member may itself be a map.
 */
export type RaiselyValue =
	| string
	| number
	| boolean
	| null
	| Record<string, RaiselyCustomValue>;

/**
 * Drops unset values so an absent filter is not serialised. The same helper
 * builds a request body, whose `public`/`private` maps are objects rather than
 * scalars. Raisely reads `private` and `offset` strictly enough that an empty
 * value is a different query.
 */
export function queryOf(
	values: Record<string, RaiselyValue | undefined>,
): Record<string, RaiselyValue> {
	const kept = Object.entries(values).filter(
		(entry): entry is [string, RaiselyValue] => entry[1] !== undefined,
	);
	return Object.fromEntries(kept);
}
