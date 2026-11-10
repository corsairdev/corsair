import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { RemarketyContext } from '..';
import type { RemarketyRequest } from '../client';
import { makeRemarketyRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response, then
 * logs the event.
 *
 * Inputs are logged only through `log`: a contact carries an email and name, and a
 * template carries HTML, so neither is logged. The callbacks report IDs, counts and
 * statuses instead.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: RemarketyContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => RemarketyRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeRemarketyRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`remarkety.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/** A store-scoped path. */
export function storePath(storeId: number, suffix = ''): string {
	return `/stores/${encodeURIComponent(String(storeId))}${suffix}`;
}
