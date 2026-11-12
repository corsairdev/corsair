import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { ReferralrockContext } from '..';
import type { ReferralrockRequest } from '../client';
import { makeReferralrockRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Member and referral names and email addresses are
 * personal data, so `log` records ids and counts rather than free text.
 *
 * A `message` field is where Referral Rock explains a refusal. It is returned to
 * the caller as part of the result, not thrown, so a create that answers
 * `{ member: null, message }` resolves and the caller reads `message`.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: ReferralrockContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => ReferralrockRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeReferralrockRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`referralrock.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Drops unset query values so an absent filter is not serialised. Referral Rock
 * reads `offset` and `count` strictly enough that an empty value is a different
 * query.
 */
export function queryOf(
	values: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> {
	const kept = Object.entries(values).filter(
		([, value]) => value !== undefined,
	);
	return Object.fromEntries(kept);
}
