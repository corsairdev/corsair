import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { KickboxContext } from '..';
import type { KickboxRequest } from '../client';
import { KICKBOX_OPEN_BASE, makeKickboxRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event.
 *
 * An address is personal data, so the log carries the domain and the result but
 * never the address itself.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: KickboxContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => KickboxRequest,
	options: {
		// unknown: raw is the response body. The output schema validates
		// whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeKickboxRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`kickbox.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/** The domain half of an address, for a log line that omits the local part. */
export function domainOf(address: string): string | undefined {
	const at = address.lastIndexOf('@');
	return at === -1 ? undefined : address.slice(at + 1).toLowerCase();
}

/**
 * The disposable check is free and keyless, but a key is still required to
 * reach an endpoint at all: `core/endpoints/bind.ts` resolves the account key
 * before it invokes anything, so an operation cannot run without one. The open
 * host is used so no credit is spent and the key never travels to it.
 */
export const OPEN_BASE = KICKBOX_OPEN_BASE;
