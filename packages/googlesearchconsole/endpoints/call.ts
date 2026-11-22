import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { GoogleSearchConsoleContext } from '..';
import type { GoogleSearchConsoleRequest } from '../client';
import { makeGoogleSearchConsoleRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the response, then logs the
 * event.
 *
 * The log payload is a count or a flag: a property URL names a customer's site
 * and stays out of event payloads.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: GoogleSearchConsoleContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown, // unknown: parsed by the operation's input schema.
	toRequest: (parsed: z.output<Input>) => GoogleSearchConsoleRequest,
	lookup?: (result: z.output<Output>) => LogFields,
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeGoogleSearchConsoleRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(raw);

	await logEventFromContext(
		ctx,
		`googlesearchconsole.${operation.event}`,
		lookup?.(result) ?? {},
		'completed',
	);
	return result;
}

/** Log fields for a list: how many rows this response holds. */
export function rowCount(
	rows: { length: number } | null | undefined,
): LogFields {
	return { count: rows?.length ?? 0 };
}
