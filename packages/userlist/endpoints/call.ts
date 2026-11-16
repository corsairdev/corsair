import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { UserlistContext } from '..';
import type { UserlistRequest } from '../client';
import { makeUserlistRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the write, then logs the event.
 *
 * There is no response to validate: the Push API answers `202` with an empty
 * body and applies the payload later. So the result is an acknowledgement that
 * says what was queued, and the `output` schema validates that instead.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: UserlistContext,
	operation: {
		event: string;
		input: Input;
		output: Output;
		/** Names the queued work, e.g. `users.upsert`. */
		label: string;
	},
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => UserlistRequest,
	options: {
		/** The identifier the write names, when it has one. */
		identifier?: (parsed: z.output<Input>) => string | undefined;
		log?: (parsed: z.output<Input>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	await makeUserlistRequest(ctx.key, toRequest(parsed));

	const queuedAt = new Date().toISOString();
	const result = operation.output.parse({
		accepted: true,
		operation: operation.label,
		identifier: options.identifier?.(parsed),
		queuedAt,
	});

	await logEventFromContext(
		ctx,
		`userlist.${operation.event}`,
		options.log?.(parsed) ?? {},
		'completed',
	);
	return result;
}
