import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { SuitedashContext } from '..';
import { makeSuitedashRequest } from '../client';
import type { UnknownJson } from '../json';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * SuiteDash needs both credentials on every call. `key` carries the public id
 * and the secret key is a second account field, because there is no single-token
 * form.
 */
export async function resolveCredentials(
	ctx: SuitedashContext,
): Promise<{ publicId: string; secretKey: string }> {
	const secretKey =
		ctx.options.secretKey ?? (await ctx.keys?.get_secret_key?.());
	if (!secretKey) {
		throw new AuthMissingError(
			'suitedash',
			'api_key',
			'[auth-missing:suitedash:secret_key] SuiteDash needs both a Public ID and a Secret Key. Store the Secret Key as secret_key on the account, or pass secretKey.',
		);
	}
	return { publicId: ctx.key, secretKey };
}

/**
 * Validates the input, sends the request and validates the response, then logs
 * the event. Contact details are not logged: a contact carries an email address
 * and a company its address, so `log` picks ids and counts.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: SuitedashContext,
	operation: { event: string; input: Input; output: Output },
	rawInput: UnknownJson, // unknown: raw caller input, parsed by the input schema
	toRequest: (parsed: z.output<Input>) => {
		method: 'GET' | 'POST' | 'PUT';
		path: string;
		query?: Record<string, string | number | boolean | undefined>;
		body?: UnknownJson; // unknown: already validated by the input schema
	},
	options: {
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const credentials = await resolveCredentials(ctx);
	const { method, path, query, body } = toRequest(parsed);
	const raw = await makeSuitedashRequest(credentials, {
		method,
		path,
		query,
		body,
	});
	const result = operation.output.parse(raw);

	await logEventFromContext(
		ctx,
		`suitedash.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * A company is addressed by uid or exact name, and a contact by uid or email;
 * SuiteDash decides which from the value. There is no lookup step here, because
 * the provider already accepts either form in the path.
 */
