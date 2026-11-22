import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { GoogleAdminContext } from '..';
import type { GoogleAdminRequest } from '../client';
import { makeGoogleAdminRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the response, then logs the
 * event.
 *
 * The log payload is a count or a flag, never an identifier: a `userKey`,
 * `groupKey` or member address is usually an email address, and R8 keeps those
 * out of event payloads.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: GoogleAdminContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown, // unknown: the operation's input schema validates it below.
	// A promise when the request needs a lookup first, as members.update does.
	toRequest: (
		parsed: z.output<Input>,
	) => GoogleAdminRequest | Promise<GoogleAdminRequest>,
	lookup?: (result: z.output<Output>) => LogFields,
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeGoogleAdminRequest(ctx.key, await toRequest(parsed));
	const result = operation.output.parse(raw);

	await logEventFromContext(
		ctx,
		`googleadmin.${operation.event}`,
		lookup?.(result) ?? {},
		'completed',
	);
	return result;
}

/** Log fields for a list: how many rows this page holds. */
export function pageCount(
	rows: { length: number } | null | undefined,
): LogFields {
	return { count: rows?.length ?? 0 };
}
