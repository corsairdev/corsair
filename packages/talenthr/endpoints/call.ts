import { asRecord, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { TalentHRContext } from '..';
import type { TalentHRRequest } from '../client';
import { makeTalentHRRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * TalentHR wraps every successful answer as `{ success: true, data }` and
 * leaves `data` out of the deletes, which answer `{ success: true }` alone.
 * Unwrapping here keeps the output schemas describing the record itself while
 * the delete schemas still see the envelope they document.
 */
// unknown: the body is untyped until asRecord narrows it.
export function unwrapEnvelope(raw: unknown): unknown {
	const record = asRecord(raw);
	if (!record) return raw;
	return 'data' in record ? record.data : raw;
}

/**
 * Validates the input, sends the request, unwraps TalentHR's envelope,
 * validates the result, then logs the event. Inputs are not logged whole,
 * because employee records hold SSNs and personal email addresses; `log` picks
 * the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: TalentHRContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => TalentHRRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeTalentHRRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : unwrapEnvelope(raw),
	);

	await logEventFromContext(
		ctx,
		`talenthr.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
