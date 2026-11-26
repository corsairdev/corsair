import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { MailerLiteContext } from '..';
import type { MailerLiteRequest } from '../client';
import { makeMailerLiteRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. The `{ data, links, meta }` envelope passes through
 * unchanged, so `data` and the pagination fields stay exactly as MailerLite
 * sent them.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: MailerLiteContext,
	operation: { event: string; input: Input; output: Output },
	rawInput: unknown, // unknown: raw caller input, parsed below by the input schema.
	toRequest: (parsed: z.output<Input>) => MailerLiteRequest,
	options: {
		// unknown: raw is the response body, validated by the output schema.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown; // unknown: raw is the untyped response body
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeMailerLiteRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`mailerlite.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
