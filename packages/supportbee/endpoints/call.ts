import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { SupportbeeContext } from '..';
import type { SupportbeeRequest } from '../client';
import { makeSupportbeeRequest, normalizeSupportbeeCompany } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Resolves the desk address from the plugin option first, then the stored
 * `company` key, so a single-desk setup can configure it once. SupportBee has no
 * shared API host, so this has to be present before any request. Both sources go
 * through `normalizeSupportbeeCompany`, which only ever returns
 * `{company}.supportbee.com`.
 */
export async function resolveCompany(ctx: SupportbeeContext): Promise<string> {
	const fromOptions = ctx.options?.company?.trim();
	if (fromOptions) return normalizeSupportbeeCompany(fromOptions);

	// unknown: `get_company` exists only when the plugin declares it in
	// authConfig, and `ctx.keys` itself is absent on a context built without a
	// key manager (as a bare `key` option does).
	const keys = ctx.keys as unknown as
		| { get_company?: () => Promise<string | null | undefined> }
		| undefined;
	const fromKeys = (await keys?.get_company?.())?.trim();
	if (fromKeys) return normalizeSupportbeeCompany(fromKeys);

	throw new AuthMissingError(
		'supportbee',
		'api_key',
		'[auth-missing:supportbee:company] SupportBee has no shared API host, so it needs the desk address. Set supportbee({ company: "acme" }) or store it with keys.set_company("acme").',
	);
}

/**
 * Validates the input, resolves the company, sends the request, validates the
 * response, then logs the event. Ticket text is not logged: a ticket carries a
 * customer's email and the body of their message, so `log` picks ids and counts.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: SupportbeeContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => SupportbeeRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});

	/** Logging never decides the outcome: a log failure must not mask a result. */
	const logSafely = async (
		payload: LogFields,
		status: 'completed' | 'failed',
	): Promise<void> => {
		await logEventFromContext(
			ctx,
			`supportbee.${operation.event}`,
			payload,
			status,
		).catch(() => undefined);
	};

	let result: z.output<Output>;
	try {
		const company = await resolveCompany(ctx);
		const raw = await makeSupportbeeRequest(
			company,
			ctx.key,
			toRequest(parsed),
		);
		result = operation.output.parse(
			options.shape ? options.shape(raw, parsed) : raw,
		);
	} catch (error) {
		// Only the request and the response parse are inside this try. The success
		// log is outside it on purpose: `logEvent` throws when `encryptDataAtRest`
		// is configured without a kek, and if a *write* had already landed, a
		// rethrow from here would report success as failure and a retry would
		// duplicate it.
		await logSafely(
			{
				failed: true,
				error: error instanceof Error ? error.message : String(error),
			},
			'failed',
		);
		throw error;
	}

	await logSafely(options.log?.(parsed, result) ?? {}, 'completed');
	return result;
}

/**
 * Reads one wrapper key off a list response, throwing when it is missing or is
 * not an array. SupportBee answers a route it does not have with an HTML page,
 * so a caller that got a 200 with the wrong shape needs a named failure rather
 * than an empty list.
 * unknown: the body is untyped until this reads it.
 */
export function unwrapList(
	raw: unknown,
	key: string,
	label: string,
): unknown[] {
	if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
		throw new Error(`SupportBee returned an unexpected ${label} body`);
	}
	const value = (raw as Record<string, unknown>)[key];
	if (!Array.isArray(value)) {
		throw new Error(`SupportBee returned no ${key} array for ${label}`);
	}
	return value;
}

/**
 * Rejects a body that is not the object a get or a write should answer, and
 * returns it as a record so a list can be merged onto its paging fields.
 * unknown: the body is untyped until this checks it.
 */
export function unwrapObject(
	raw: unknown,
	label: string,
): Record<string, unknown> {
	if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
		throw new Error(`SupportBee returned an unexpected ${label} body`);
	}
	return raw as Record<string, unknown>;
}

/** Drops unset query values so nothing empty is sent. */
export function queryOf(
	values: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> {
	return Object.fromEntries(
		Object.entries(values).filter(([, value]) => value !== undefined),
	);
}

/** A 204 answers with no body, so the plugin reports the id and the action. */
export function ticketAction(id: number): { id: number; updated: true } {
	return { id, updated: true };
}
