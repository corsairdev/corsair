import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { TldvContext } from '..';
import type { TldvRequest } from '../client';
import { makeTldvRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Transcripts and notes hold meeting content, so `log`
 * records identifiers and counts rather than text.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: TldvContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => TldvRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeTldvRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`tldv.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Drops unset query values. tl;dv rejects an empty `meetingType` with a 400
 * listing every allowed value, so a caller's unset filter must not be sent.
 */
export function queryOf(
	values: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> {
	return Object.fromEntries(
		Object.entries(values).filter(([, value]) => value !== undefined),
	);
}
