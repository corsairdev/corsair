import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { RocketReachContext } from '..';
import type { RocketReachRequest } from '../client';
import { makeRocketReachRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response, then
 * logs the event.
 *
 * Inputs are logged only through `log`: these calls take email addresses, phone
 * numbers and names, and none of that belongs in the event log. The `log`
 * callbacks report counts and statuses instead.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: RocketReachContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => RocketReachRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeRocketReachRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`rocketreach.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Turns a lookup's identifiers into query parameters.
 *
 * RocketReach answers a lookup with whatever it can match, so an empty object
 * would spend a credit on nothing. The input schema already rejects a call with
 * no identifiers; this keeps the mapping in one place.
 */
export function lookupQuery(input: {
	email?: string;
	id?: string | number;
	linkedin_url?: string;
	name?: string;
	current_employer?: string;
	title?: string;
	phone?: string;
	npi_number?: string;
	lookup_type?: string;
	return_cached_emails?: boolean;
	webhook_id?: number;
}): Record<string, string | number | boolean | undefined> {
	return {
		email: input.email,
		id: input.id === undefined ? undefined : String(input.id),
		linkedin_url: input.linkedin_url,
		name: input.name,
		current_employer: input.current_employer,
		title: input.title,
		phone: input.phone,
		npi_number: input.npi_number,
		lookup_type: input.lookup_type,
		return_cached_emails: input.return_cached_emails,
		webhook_id: input.webhook_id,
	};
}
