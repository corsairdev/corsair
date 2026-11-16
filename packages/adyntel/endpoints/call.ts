import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { AdyntelContext } from '..';
import type { AdyntelRequest } from '../client';
import { makeAdyntelRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged: they are company domains and
 * keywords, and the log is for accounting, not a search history.
 *
 * Credentials are resolved in `keyBuilder` rather than here, so a caller with
 * a key but no email gets the same `AuthMissingError` treatment, connect link
 * included, as a caller with no key.
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
	// The key is the API key and the email, joined by the key builder, because
	// Adyntel needs both and a key without its email is a 401.
	const [apiKey, email] = ctx.key.split('\u0000');
	if (!apiKey || !email) {
		throw new Error(
			'adyntel: key builder returned an incomplete credential pair',
		);
	}

	const response = await makeAdyntelRequest(
		{ apiKey, email },
		toRequest(parsed),
	);

	// A 204 is "nothing found", which every output schema accepts as `{}`
	// because all their fields are nullish. A body read that failed never
	// reaches here: the client throws for it.
	const raw = response.kind === 'no-content' ? {} : response.body;
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
