import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { SimpleanalyticsContext } from '..';
import type { SimpleanalyticsRequest } from '../client';
import { makeCheckedRequest } from '../client';
import type { UnknownJson } from '../json';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * The Admin API also needs the user id, in a `User-Id` header, and it is a
 * second credential rather than part of the key, so it is read from the
 * account's stored `user_id` like the key itself. Every other route works with
 * the key alone.
 */
export async function adminHeaders(
	ctx: SimpleanalyticsContext,
): Promise<Record<string, string>> {
	const stored = await ctx.keys?.get_user_id?.();
	if (stored) return { 'User-Id': stored };

	throw new AuthMissingError(
		'simpleanalytics',
		'api_key',
		'[auth-missing:simpleanalytics:user_id] The Admin API needs the user id shown next to the API key in the account settings. Store user_id on the account.',
	);
}

/**
 * Validates the input, sends the request through the body-checking client,
 * shapes and validates the response, then logs the event. Query strings are
 * not logged: they carry the page and metadata filters a caller already knows.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: SimpleanalyticsContext,
	operation: { event: string; input: Input; output: Output },
	rawInput: UnknownJson, // unknown: raw caller input, parsed by the input schema
	toRequest: (parsed: z.output<Input>) => Promise<SimpleanalyticsRequest>,
	options: {
		shape?: (
			raw: UnknownJson, // unknown: the response body, absent when empty
			parsed: z.output<Input>,
		) => UnknownJson; // unknown: the output schema validates what this returns
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeCheckedRequest(ctx.key, await toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`simpleanalytics.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
