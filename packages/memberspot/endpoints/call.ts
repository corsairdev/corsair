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
	const result = operation.output.parse(raw);

	await logEventFromContext(
		ctx,
		`memberspot.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/** Drops undefined entries so a body matches the DTO the API documents. */
export function bodyOf(
	fields: Record<string, unknown>,
): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(fields).filter(([, value]) => value !== undefined),
	);
}
