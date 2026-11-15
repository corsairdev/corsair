import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { RemoteRetrievalContext } from '..';
import type { RemoteRetrievalRequest } from '../client';
import { makeRemoteRetrievalRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response, then
 * logs the event.
 *
 * Inputs are logged only through `log`: an order carries an employee's name,
 * home address, email and phone, so none of that is logged. The callbacks report
 * order IDs, device types and counts instead.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: RemoteRetrievalContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => RemoteRetrievalRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeRemoteRetrievalRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`remoteretrieval.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
