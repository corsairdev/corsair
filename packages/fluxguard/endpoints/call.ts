import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { FluxguardContext } from '..';
import type { FluxguardRequest } from '../client';
import { makeFluxguardRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: FluxguardContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => FluxguardRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeFluxguardRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`fluxguard.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Fluxguard documents keyed collections ("an object indexed by category ID")
 * but the API is in beta and may also answer with a flat array. Accept either
 * and reject anything else, so a wrong shape fails instead of becoming an
 * empty list.
 */
export function toArray(
	raw: unknown,
	label: string,
): Record<string, unknown>[] {
	if (Array.isArray(raw)) return raw as Record<string, unknown>[];
	if (raw !== null && typeof raw === 'object') {
		return Object.values(raw as Record<string, unknown>).filter(
			(value): value is Record<string, unknown> =>
				value !== null && typeof value === 'object' && !Array.isArray(value),
		);
	}
	throw new Error(`Fluxguard returned an unexpected ${label} body`);
}
