import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { NasaContext } from '..';
import type { NasaRequest } from '../client';
import { makeNasaRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * EONET labels its JSON responses `application/rss+xml`, and corsair/http turns
 * anything that is not `application/json` into text. Parsing here keeps the
 * output schema the thing that validates the shape.
 */
// unknown: JSON.parse returns any, so the caller narrows it with an output
// schema before touching a field.
export function parseJsonText(raw: string): unknown {
	// unknown: JSON.parse returns any; the output schema narrows it next.
	return JSON.parse(raw) as unknown;
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. No inputs are logged beyond the identifiers `log` picks.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: NasaContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown, // unknown: parsed by the operation's input schema
	toRequest: (parsed: z.output<Input>) => NasaRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown; // unknown: see above
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeNasaRequest(ctx.key, toRequest(parsed));
	// EONET labels JSON `application/rss+xml`, so a string body is parsed here
	// before the shape functions read its fields.
	const body = typeof raw === 'string' ? parseJsonText(raw) : raw;
	const result = operation.output.parse(
		options.shape ? options.shape(body, parsed) : body,
	);

	await logEventFromContext(
		ctx,
		`nasa.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
