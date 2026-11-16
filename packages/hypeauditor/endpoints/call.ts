import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { HypeAuditorContext } from '..';
import type { HypeAuditorRequest } from '../client';
import {
	asHypeAuditorKeys,
	makeHypeAuditorRequest,
	resolveCredentials,
} from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request and parses the response.
 *
 * The credentials are read on every call, because both the Client ID and the
 * token live on the account and either can be replaced between calls.
 *
 * Inputs are not logged: a report request names a creator's account, and the
 * docs describe those as personal data, so `log` picks the fields to keep.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: HypeAuditorContext,
	operation: { event: string; input: Input; output: Output },
	// Each caller passes its endpoint's own input type, which the schema in
	// `operation` validates.
	// unknown: core hands the bound endpoint whatever the caller wrote, so this
	// argument arrives without a static type.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => Omit<HypeAuditorRequest, 'method'> & {
		method?: HypeAuditorRequest['method'];
	},
	options: {
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const credentials = await resolveCredentials(
		asHypeAuditorKeys(ctx.keys),
		'hypeauditor',
	);
	const request_ = toRequest(parsed);

	// The body is untyped until the output schema below parses it.
	const raw = await makeHypeAuditorRequest(credentials, {
		method: request_.method ?? 'GET',
		action: request_.action,
		query: request_.query,
		body: request_.body,
		replayable: request_.replayable,
	});

	const result = operation.output.parse(raw);

	await logEventFromContext(
		ctx,
		`hypeauditor.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
