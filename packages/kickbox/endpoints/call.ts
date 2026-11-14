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

// One or more DNS labels and a letter-only TLD, such as `mailinator.com`.
const HOSTNAME =
	/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

/**
 * The domain half of an address, for a log line that omits the local part. A
 * bare domain, which `verify.disposable` accepts, is already the domain.
 * Anything that is not a hostname gives undefined, so text a caller passed by
 * mistake (a name, a local part) never reaches the event log.
 */
export function domainOf(address: string): string | undefined {
	const at = address.lastIndexOf('@');
	const domain = (at === -1 ? address : address.slice(at + 1)).toLowerCase();
	return HOSTNAME.test(domain) ? domain : undefined;
}

/**
 * The disposable check is free and keyless, but a key is still required to
 * reach an endpoint at all: `core/endpoints/bind.ts` resolves the account key
 * before it invokes anything, so an operation cannot run without one. The open
 * host is used so no credit is spent and the key never travels to it.
 */
export const OPEN_BASE = KICKBOX_OPEN_BASE;
