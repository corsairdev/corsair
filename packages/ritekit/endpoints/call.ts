import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { RiteKitContext } from '..';
import type { RiteKitRequest } from '../client';
import { makeRiteKitRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response, then
 * logs the event.
 *
 * Inputs are logged only through `log`: most of these calls take a post, an
 * email address or a URL, and none of that belongs in the event log by default.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: RiteKitContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => RiteKitRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeRiteKitRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`ritekit.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/** Joins a list into the comma-separated form RiteKit splits itself. */
export function tagList(tags: string[]): string {
	return tags.join(',');
}
