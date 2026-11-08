import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { DeskTimeContext } from '..';
import type { DeskTimeQuery } from '../client';
import { makeDeskTimeRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the response, then logs the
 * event. Inputs are not logged: an employee id and date are enough to identify
 * a person, so `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: DeskTimeContext,
	operation: {
		event: string;
		input: Input;
		output: Output;
	},
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => {
		action: string;
		query?: DeskTimeQuery;
	},
	options: {
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const { action, query } = toRequest(parsed);
	const raw = await makeDeskTimeRequest(ctx.key, action, query);
	const result = operation.output.parse(raw);

	await logEventFromContext(
		ctx,
		`desktime.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
