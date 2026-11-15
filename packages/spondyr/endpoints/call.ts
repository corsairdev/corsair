import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { SpondyrContext } from '..';
import type { SpondyrCredentials, SpondyrRequest } from '../client';
import { makeSpondyrRequest } from '../client';
import { SpondyrOperationError } from '../error-handlers';

type LogFields = Record<string, string | number | boolean | undefined>;

/** The slice of the account key manager the client needs. */
export type SpondyrCredentialContext = {
	keys: {
		get_api_key: () => Promise<string | null | undefined>;
		get_application_token: () => Promise<string | null | undefined>;
	};
	options?: { applicationToken?: string };
};

/**
 * Resolves both credentials for a request. Spondyr needs the Subscription API
 * key and the Application Token on every call, and core only passes one `key`
 * string into the endpoint, so the token comes from the account config here.
 */
export async function resolveCredentials(
	ctx: SpondyrCredentialContext,
	apiKey: string,
): Promise<SpondyrCredentials> {
	const applicationToken =
		ctx.options?.applicationToken ?? (await ctx.keys.get_application_token());
	if (!applicationToken) {
		throw new SpondyrOperationError(
			'The Application Token is missing from the account. Add it alongside the API key.',
		);
	}
	return { apiKey, applicationToken };
}

/**
 * Validates the input, sends the request, checks `APIStatus`, shapes and
 * validates the response, then logs the event.
 *
 * Inputs are not logged as-is: `send.data` carries the document's contents,
 * which can include a name and address, so `log` names the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: SpondyrContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: parsed below by the operation's input schema.
	rawInput: unknown, // unknown: parsed below by the input schema.
	toRequest: (parsed: z.output<Input>) => SpondyrRequest,
	options: {
		// unknown: raw is the response body; the output schema validates the
		// value this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown; // unknown: both sides.
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
		/** Skip the `APIStatus` check for a route that does not send one. */
		skipStatusCheck?: boolean;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const credentials = await resolveCredentials(ctx, ctx.key);
	const raw = await makeSpondyrRequest(credentials, toRequest(parsed));
	if (!options.skipStatusCheck) assertApiStatus(raw, operation.event);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`spondyr.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Spondyr answers 200 with `APIStatus: 'ERROR'` for most failures, so the status
 * code alone does not say whether the call worked. Reads `ErrorMessage` out of
 * the envelope and throws.
 */
export function assertApiStatus(
	// unknown: the raw envelope, before the operation's output schema runs.
	raw: unknown, // unknown: the raw envelope, before the output schema runs.
	operation: string,
): void {
	if (typeof raw !== 'object' || raw === null) return;
	const record = raw as Record<string, unknown>; // unknown: narrowed above.
	if (record.APIStatus !== 'ERROR') return;
	const message =
		typeof record.ErrorMessage === 'string' && record.ErrorMessage.length > 0
			? record.ErrorMessage
			: 'no message given';
	throw new SpondyrOperationError(`${operation} was refused: ${message}`);
}
