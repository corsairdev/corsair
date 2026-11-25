import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { LushaContext } from '..';
import type { LushaRequest } from '../client';
import { makeLushaRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the response, then logs
 * the event. Inputs are not logged, because search entries carry names, email
 * addresses and LinkedIn URLs; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: LushaContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => LushaRequest,
	options: {
		// unknown: raw is the response body, parsed by the output schema below.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeLushaRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`lusha.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/** Billing fields are nullish in the schema and LogFields rejects null. */
export function billingLog(result: {
	billing?:
		| {
				creditsCharged?: number | null | undefined;
				resultsReturned?: number | null | undefined;
		  }
		| null
		| undefined;
}): LogFields {
	return {
		creditsCharged: result.billing?.creditsCharged ?? undefined,
		resultsReturned: result.billing?.resultsReturned ?? undefined,
	};
}
