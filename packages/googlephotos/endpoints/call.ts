import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { GooglePhotosContext } from '..';
import type { GooglePhotosRequest } from '../client';
import { makeGooglePhotosRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the response, then logs the
 * event. The log payload is a count: an album id or a media item id is account
 * data and stays out of event payloads.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: GooglePhotosContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => GooglePhotosRequest,
	lookup?: (result: z.output<Output>) => LogFields,
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeGooglePhotosRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(raw);

	await logEventFromContext(
		ctx,
		`googlephotos.${operation.event}`,
		lookup?.(result) ?? {},
		'completed',
	);
	return result;
}

/** Log fields for a list: how many rows this page holds. */
export function rowCount(
	rows: { length: number } | null | undefined,
): LogFields {
	return { count: rows?.length ?? 0 };
}
