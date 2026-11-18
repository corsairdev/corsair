import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { NasdaqContext } from '..';
import type { NasdaqRequest } from '../client';
import { makeNasdaqRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Only the identifiers `log` picks are logged.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: NasdaqContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => NasdaqRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeNasdaqRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`nasdaq.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Flattens the `filters` map into the query string Nasdaq expects, keeping
 * operator suffixes intact: `{ 'date.gte': '2024-01-01' }` becomes
 * `date.gte=2024-01-01`. Keys are not re-encoded, because `[]` in
 * `ticker.in[]` is part of the operator name.
 */
export function filterQuery(
	filters: Record<string, string | number | boolean> | undefined,
): Record<string, string | number | boolean | undefined> {
	if (!filters) return {};
	return { ...filters };
}
