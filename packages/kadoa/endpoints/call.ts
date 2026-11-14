import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { KadoaContext } from '..';
import type { KadoaRequest } from '../client';
import { makeKadoaRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged: a variable value and a workflow
 * `variables` map can both hold a credential, so `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: KadoaContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => KadoaRequest,
	options: {
		// unknown: raw is the response body. The output schema validates
		// whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeKadoaRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`kadoa.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/** Drops the keys whose value is undefined, so a query carries only what was asked for. */
export function definedQuery(
	query: Record<string, string | number | boolean | string[] | undefined>,
): Record<string, string | number | boolean | string[]> {
	return Object.fromEntries(
		Object.entries(query).filter(
			(entry): entry is [string, string | number | boolean | string[]] =>
				entry[1] !== undefined,
		),
	);
}
