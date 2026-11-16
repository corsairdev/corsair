import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { SimplekpiContext } from '..';
import type { SimplekpiRequest } from '../client';
import { makeSimplekpiRequest } from '../client';
import type { UnknownJson } from '../json';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Field values are not logged: an entry carries the
 * numbers and notes a caller already has, so `log` picks identifiers only.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: SimplekpiContext,
	operation: { event: string; input: Input; output: Output },
	rawInput: UnknownJson, // unknown: raw caller input, parsed by the input schema
	toRequest: (parsed: z.output<Input>) => SimplekpiRequest,
	options: {
		shape?: (
			raw: UnknownJson, // unknown: the response body, absent when empty
			parsed: z.output<Input>,
		) => UnknownJson; // unknown: the output schema validates what this returns
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeSimplekpiRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`simplekpi.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Every delete answers 204 with no body, so the result is built from the input.
 * A body here means the route changed or a proxy answered an error page with a
 * 2xx; reporting success would be wrong either way, so this throws.
 */
export function deletion(
	raw: UnknownJson, // unknown: the body of a 204, which should be empty
	operation: string,
	id: number,
): { id: number; deleted: true } {
	// Core returns undefined (or an empty string) for a 204; JSON `{}`, `[]` or
	// `null` is a body, which this route documents it never sends.
	if (raw !== undefined && raw !== '') {
		throw new Error(
			`${operation} answered with a body, but SimpleKPI documents this route as bodyless. Nothing was confirmed; re-read the resource before assuming the change applied.`,
		);
	}
	return { id, deleted: true as const };
}
