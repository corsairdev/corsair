import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { PayhipContext } from '..';
import type { PayhipRequest } from '../client';
import { makePayhipRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the response, then logs
 * the event. License-key operations authenticate with the per-product
 * secret from the account; coupon operations with the account API key.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: PayhipContext,
	operation: {
		event: string;
		input: Input;
		output: Output;
		/** License operations authenticate with the product secret instead of the account key. */
		productSecret?: boolean;
	},
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => PayhipRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	// License calls authenticate with the product secret stored on the
	// connection (R8: credentials come from stored credentials, never from
	// options or input); coupon calls with the account key the binder resolved.
	let credential = ctx.key;
	if (operation.productSecret) {
		const productSecret = await ctx.keys.get_product_secret_key();
		if (!productSecret) {
			throw new AuthMissingError('payhip', 'api_key');
		}
		credential = productSecret;
	}
	const raw = await makePayhipRequest(credential, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`payhip.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
