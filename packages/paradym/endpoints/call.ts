import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { ParadymContext } from '..';
import type { ParadymRequest } from '../client';
import { makeParadymRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Resolves the wallet every wallet-scoped route is scoped to: the plugin
 * option wins over the stored wallet id on the account.
 */
export async function resolveWalletId(ctx: ParadymContext): Promise<string> {
	const walletId =
		ctx.options?.walletId ?? (await ctx.keys.get_wallet_id()) ?? '';
	if (!walletId) {
		throw new Error(
			'No Paradym wallet configured: pass walletId in the plugin options or store it on the account (wallet_id).',
		);
	}
	return walletId;
}

/**
 * Validates the input, sends the request, validates the response, then logs
 * the event. Inputs are not logged because credential data carries personal
 * information; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: ParadymContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>, walletId: string) => ParadymRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
		skipWallet?: boolean;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const walletId = options.skipWallet ? '' : await resolveWalletId(ctx);
	const raw = await makeParadymRequest(ctx.key, toRequest(parsed, walletId));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`paradym.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Shapes a 204-with-no-body success. Paradym documents an empty body for
 * these routes, so anything else is a failure the caller must see rather
 * than a fabricated success.
 */
// unknown: raw is the untouched response body; any shape is possible until
// the caller decides it is a failure.
export function expectEmptyBody(raw: unknown, what: string): void {
	if (raw !== undefined && raw !== null && raw !== '') {
		throw new Error(`Paradym ${what}: unexpected body ${JSON.stringify(raw)}`);
	}
}
