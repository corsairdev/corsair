import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { TombaContext } from '..';
import type { TombaCredentials, TombaRequest } from '../client';
import { makeTombaRequest } from '../client';
import { TombaOperationError } from '../error-handlers';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * The key builder packs both credentials into `ctx.key` as JSON, because core
 * hands the endpoint one key string and Tomba needs the API key and the API
 * secret on every request.
 */
export function resolveCredentials(key: string): TombaCredentials {
	let parsed: unknown; // unknown: the packed key is checked field by field.
	try {
		parsed = JSON.parse(key);
	} catch {
		parsed = undefined;
	}
	const record =
		parsed && typeof parsed === 'object'
			? (parsed as Record<string, unknown>)
			: undefined;
	const apiKey = record?.apiKey;
	const apiSecret = record?.apiSecret;
	if (typeof apiKey !== 'string' || typeof apiSecret !== 'string') {
		throw new TombaOperationError(
			'The Tomba credentials are incomplete. Connect the account with both the API key and the API secret.',
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
	const credentials = resolveCredentials(ctx.key);
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
