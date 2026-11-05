import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { TicketmasterRequest } from '../client';
import { makeTicketmasterRequest } from '../client';
import type { TicketmasterContext } from '../index';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the GET, shapes and validates the response, then
 * logs the event. `log` picks the fields, so a search keyword never reaches the
 * event log.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: TicketmasterContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => TicketmasterRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeTicketmasterRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`ticketmaster.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
