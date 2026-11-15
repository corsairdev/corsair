import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { TombaContext } from '..';
import type { TombaCredentials, TombaRequest } from '../client';
import { makeTombaRequest } from '../client';
import { TombaOperationError } from '../error-handlers';

type LogFields = Record<string, string | number | boolean | undefined>;

/** The slice of the account key manager the client needs. */
export type TombaCredentialContext = {
	keys: {
		get_api_key: () => Promise<string | null | undefined>;
		get_api_secret: () => Promise<string | null | undefined>;
	};
	options?: { apiSecret?: string };
};

/**
 * Resolves both credentials. Tomba needs the API key and the API secret on
 * every request, and core passes only one `key` string into the endpoint, so the
 * secret is read from the account here.
 */
export async function resolveCredentials(
	ctx: TombaCredentialContext,
	apiKey: string,
): Promise<TombaCredentials> {
	const apiSecret = ctx.options?.apiSecret ?? (await ctx.keys.get_api_secret());
	if (!apiSecret) {
		throw new TombaOperationError(
			'The API secret is missing from the account. Add it alongside the API key.',
		);
	}
	return { apiKey, apiSecret };
}

/**
 * Validates the input, sends the request, validates the response, then logs the
 * event. Inputs are mostly a domain or an email address, so `log` names only the
 * fields that are safe to store.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: TombaContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => TombaRequest,
	options: {
		// unknown: raw is the response body; the output schema validates it.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const credentials = await resolveCredentials(ctx, ctx.key);
	const raw = await makeTombaRequest(credentials, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`tomba.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
