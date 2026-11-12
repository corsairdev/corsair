import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { MailssoContext } from '..';
import type { MailssoBody, MailssoRequest } from '../client';
import { makeMailssoRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged, because they hold email
 * addresses; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: MailssoContext,
	operation: { event: string; input: Input; output: Output },
	rawInput: MailssoBody,
	toRequest: (parsed: z.output<Input>) => MailssoRequest,
	options: {
		shape?: (raw: MailssoBody) => MailssoBody;
		log?: (result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput);
	const raw = await makeMailssoRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw) : raw,
	);

	await logEventFromContext(
		ctx,
		`mailsso.${operation.event}`,
		options.log?.(result) ?? {},
		'completed',
	);
	return result;
}
