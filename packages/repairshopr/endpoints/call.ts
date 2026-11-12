import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { RepairshoprContext } from '..';
import type { RepairshoprRequest } from '../client';
import { isValidSubdomain, makeRepairshoprRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Resolves the account's subdomain. A plugin created with `subdomain` uses it
 * for every call; otherwise the account's stored value is read, which is what
 * a tenant connected through the dashboard has. A missing or malformed value
 * fails here rather than producing a request to a host that does not exist.
 */
export async function resolveSubdomain(
	ctx: RepairshoprContext,
): Promise<string> {
	const configured = ctx.options.subdomain ?? (await ctx.keys.get_subdomain());
	const value = (configured ?? '').trim();
	if (!isValidSubdomain(value)) {
		throw new Error(
			'[auth-missing:repairshopr:subdomain]: RepairShopr needs the account subdomain (the part before .repairshopr.com)',
		);
	}
	return value;
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Customer names and addresses are customer data, so `log`
 * records ids and counts rather than free text.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: RepairshoprContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => RepairshoprRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const subdomain = await resolveSubdomain(ctx);
	const raw = await makeRepairshoprRequest(
		subdomain,
		ctx.key,
		toRequest(parsed),
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`repairshopr.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Drops unset query values so an absent filter is not serialised. RepairShopr
 * reads `page` and its named filters strictly enough that an empty value is a
 * different query.
 */
export function queryOf(
	values: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> {
	const kept = Object.entries(values).filter(
		([, value]) => value !== undefined,
	);
	return Object.fromEntries(kept);
}
