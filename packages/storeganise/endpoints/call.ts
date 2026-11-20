import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { StoreganiseContext } from '..';
import type { StoreganiseRequest } from '../client';
import { baseForBusiness, makeStoreganiseRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the response, then logs
 * the event. The base URL comes from the account's business code, the
 * per-tenant subdomain Storeganise serves the API on. Inputs are not logged
 * because user records carry personal data; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: StoreganiseContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>, base: string) => StoreganiseRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	// The plugin option wins over the stored business code, matching how the
	// webhook secret resolves.
	const businessCode =
		ctx.options?.businessCode ?? (await ctx.keys.get_business_code()) ?? '';
	const raw = await makeStoreganiseRequest(
		ctx.key,
		toRequest(parsed, baseForBusiness(businessCode)),
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`storeganise.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
