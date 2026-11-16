import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { NethuntContext } from '..';
import type { NethuntRequest } from '../client';
import { makeNethuntRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Resolves the account-level `email`, the username half of NetHunt's Basic
 * auth. The inline option wins so a caller can test without storing one.
 */
async function resolveEmail(ctx: NethuntContext): Promise<string> {
	if (ctx.options?.email) return ctx.options.email;
	const stored = await ctx.keys?.get_email?.();
	return stored ?? '';
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. CRM field values hold names and email addresses, so only
 * the identifiers `log` picks are logged.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: NethuntContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => NethuntRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const email = await resolveEmail(ctx);
	const raw = await makeNethuntRequest(
		{ email, apiKey: ctx.key },
		toRequest(parsed),
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`nethunt.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
