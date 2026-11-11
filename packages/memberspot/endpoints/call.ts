import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { MemberSpotContext } from '..';
import type { MemberSpotQuery } from '../client';
import { makeMemberSpotRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the response, then logs the
 * event. Inputs are not logged: they carry member emails and names, so `log`
 * picks the safe fields, which are ids and counts.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: MemberSpotContext,
	operation: {
		event: string;
		input: Input;
		output: Output;
	},
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => {
		action: string;
		method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
		query?: MemberSpotQuery;
		// unknown: each operation's input schema has already validated these fields,
		// so the record is built from a literal and typed only as far as the
		// request layer needs. A single DTO type cannot cover 30 different bodies.
		body?: Record<string, unknown>;
		/**
		 * True for reads and for writes the docs describe as idempotent. A 5xx
		 * never replays anything else, because the write may already have landed.
		 */
		replaySafe?: boolean;
	},
	options: {
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const { action, method, query, body, replaySafe } = toRequest(parsed);
	const raw = await makeMemberSpotRequest(ctx.key, action, {
		method,
		query,
		body,
		replaySafe,
	});
	// Several write routes (delete-users, set-offer-expires, set-course-start-date)
	// answer 200 with no body, which the request layer returns as undefined. An
	// empty object lets those parse; a read that needs fields still fails, which
	// is how find-by-uid reports an unknown uid.
	const result = operation.output.parse(raw === undefined ? {} : raw);

	await logEventFromContext(
		ctx,
		`memberspot.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Drops undefined entries so a body matches the DTO the API documents.
 *
 * Both types are unknown because the fields differ per operation: this runs on a
 * freshly built literal with a handful of optional keys, and the endpoint's input
 * schema is what validates them before they arrive. Naming a DTO type per call
 * site would restate every schema for no check the schema does not already make.
 */
export function bodyOf(
	fields: Record<string, unknown>,
): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(fields).filter(([, value]) => value !== undefined),
	);
}
