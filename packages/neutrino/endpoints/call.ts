import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { NeutrinoContext } from '..';
import type { NeutrinoRequest } from '../client';
import { makeNeutrinoRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/** Resolves the account-level `user_id`, the username half of the credential. */
async function resolveUserId(ctx: NeutrinoContext): Promise<string> {
	if (ctx.options?.userId) return ctx.options.userId;
	const stored = await ctx.keys?.get_user_id?.();
	return stored ?? '';
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged whole: they can hold email
 * addresses and phone numbers, so `log` picks what is safe.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: NeutrinoContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => NeutrinoRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const userId = await resolveUserId(ctx);
	const raw = await makeNeutrinoRequest(
		{ userId, apiKey: ctx.key },
		toRequest(parsed),
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`neutrino.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
