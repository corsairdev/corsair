import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { SignwellContext } from '..';
import type { SignwellRequest } from '../client';
import { makeSignwellRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged verbatim: they carry recipient
 * email addresses and document bytes, so `log` picks the fields worth keeping.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: SignwellContext,
	operation: { event: string; input: Input; output: Output },
	rawInput: unknown, // unknown: raw caller input, parsed by the input schema
	toRequest: (parsed: z.output<Input>) => SignwellRequest,
	options: {
		shape?: (
			raw: unknown, // unknown: the response body, undefined when absent
			parsed: z.output<Input>,
		) => unknown; // unknown: the output schema validates what this returns
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeSignwellRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`signwell.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Every delete route answers 204 with no body, so the result is built from the
 * input. A body here means either SignWell changed the route or a proxy
 * answered an error page with a 2xx; reporting success would be wrong either
 * way, so this throws instead.
 */
export function assertBodyless(
	raw: unknown, // unknown: the body of a route the spec calls bodyless
	operation: string,
): void {
	if (raw === undefined || raw === null) return;
	if (typeof raw === 'object' && Object.keys(raw).length === 0) return;
	throw new Error(
		`${operation} answered with a body, but SignWell documents this route as bodyless. Nothing was confirmed; re-read the resource before assuming the change applied.`,
	);
}

/** The delete result every delete route shares. */
export function deletion(
	raw: unknown, // unknown: the body of a 204, which should be empty
	operation: string,
	id: string,
): { id: string; deleted: true } {
	assertBodyless(raw, operation);
	return { id, deleted: true as const };
}
