import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { StannpContext } from '..';
import type { StannpRegion, StannpRequest } from '../client';
import { makeStannpRequest, STANNP_HOSTS } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/** The host for the account's region; US unless the plugin is built with eu. */
export function baseForRegion(region: StannpRegion | undefined): string {
	return STANNP_HOSTS[region ?? 'us'];
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged, because recipients carry names,
 * addresses and email addresses; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: StannpContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>, base: string) => StannpRequest,
	options: {
		// unknown: raw is the unwrapped response body, undefined when there is
		// none. The output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeStannpRequest(
		ctx.key,
		toRequest(parsed, baseForRegion(ctx.options?.region)),
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`stannp.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
