import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { DemioContext } from '..';
import type { DemioCredentials, DemioRequest } from '../client';
import { makeDemioRequest, parseDemioCredentials } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * `ctx.key` is the packed credential pair, so an endpoint reads it back before
 * the request. A key that will not unpack means the account has no usable
 * pair, which is a missing-auth case rather than a malformed request.
 */
export function requireDemioCredentials(key: string): DemioCredentials {
	const credentials = parseDemioCredentials(key);
	if (!credentials) throw new AuthMissingError('demio', 'api_key');
	return credentials;
}

/**
 * Validates the input, sends the request, validates the answer, then logs the
 * event. Raw input is not logged: registrations carry a name and an email
 * address, and `log` picks the fields that are safe to keep.
 */
export async function callDemio<
	Input extends z.ZodType,
	Output extends z.ZodType,
>(
	ctx: DemioContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => DemioRequest,
	options: {
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeDemioRequest(
		requireDemioCredentials(ctx.key),
		toRequest(parsed),
	);
	const result = operation.output.parse(raw);

	await logEventFromContext(
		ctx,
		`demio.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
