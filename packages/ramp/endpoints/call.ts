import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { RampContext } from '..';
import type { RampRequest } from '../client';
import { makeRampRequest, RampAPIError, rampApiBase } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Memos and vendor details are business data, so `log`
 * records ids and counts rather than free text.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: RampContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => RampRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	// Checked before the request, not after: logEventFromContext seals the
	// event with the account key when encryption at rest is on, and throws when
	// the key is missing. Raised after a write, that failure would report a
	// completed write as failed and invite a retry that repeats it.
	assertEncryptionConfigured(ctx);
	const request = toRequest(parsed);
	const base = rampApiBase(ctx.options?.environment);
	let raw: unknown;
	try {
		raw = await makeRampRequest(ctx.key, request, base);
	} catch (error) {
		// Ramp rejects a revoked or expired token (404 DEVELOPER_7002) before it
		// acts, so one retry with a fresh token is safe for writes too. The hook
		// is the one oauth_2 connections set in the keyBuilder.
		const refreshAuth = (ctx as { _refreshAuth?: () => Promise<string> })
			._refreshAuth;
		if (!(error instanceof RampAPIError && error.isAuthError && refreshAuth)) {
			throw error;
		}
		raw = await makeRampRequest(await refreshAuth(), request, base);
	}
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`ramp.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Drops unset query values so an absent filter is not sent as the string
 * "undefined". Ramp validates several enums strictly and answers 400 for an
 * empty value.
 */
export function queryOf(
	values: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> {
	const kept = Object.entries(values).filter(
		([, value]) => value !== undefined,
	);
	return Object.fromEntries(kept);
}

/**
 * Refuses a request that would succeed at Ramp and then fail while logging.
 * `logEventFromContext` throws `encryptDataAtRest requires kek` when encryption
 * is on and no key is set, so the check runs before the request leaves.
 */
function assertEncryptionConfigured(ctx: RampContext): void {
	const encrypting = (ctx as { encryptDataAtRest?: boolean }).encryptDataAtRest;
	const kek = (ctx as { kek?: string }).kek;
	if (encrypting === true && !kek) {
		throw new Error(
			'encryptDataAtRest is enabled but no kek is configured, so the request would succeed and the event log would fail. Set a kek before calling this endpoint.',
		);
	}
}
