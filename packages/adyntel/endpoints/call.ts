import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { AdyntelContext } from '..';
import type { AdyntelRequest } from '../client';
import { makeAdyntelRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Adyntel authenticates with the API key *and* the account email, both as JSON
 * body fields. The key arrives as `ctx.key`; the email is an account field
 * declared in `adyntelAuthConfig`.
 */
async function resolveEmail(ctx: AdyntelContext): Promise<string> {
	const fromOptions = ctx.options?.email;
	if (fromOptions) return fromOptions;

	const stored = await ctx.keys.get_email();
	if (stored) return stored;

	throw new AuthMissingError('adyntel', 'email');
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged: they are company domains and
 * keywords, and the log is for accounting, not a search history.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: AdyntelContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (
		parsed: z.output<Input>,
	) => Omit<AdyntelRequest, 'body'> & { body: Record<string, unknown> },
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const email = await resolveEmail(ctx);
	const raw = await makeAdyntelRequest(
		{ apiKey: ctx.key, email },
		toRequest(parsed),
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`adyntel.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
