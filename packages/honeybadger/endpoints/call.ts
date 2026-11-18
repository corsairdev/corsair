import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { HoneybadgerContext } from '..';
import type {
	HoneybadgerRegion,
	HoneybadgerRequest,
	JsonValue,
} from '../client';
import { HONEYBADGER_HOSTS, makeHoneybadgerRequest } from '../client';

/**
 * The plugin option wins when set in code; otherwise the tenant's stored
 * `region` account field; otherwise the US app.
 */
export async function resolveRegion(
	ctx: HoneybadgerContext,
): Promise<HoneybadgerRegion> {
	if (ctx.options?.region) return ctx.options.region;
	let stored: string | undefined;
	try {
		stored = (await ctx.keys?.get_region?.())?.trim().toLowerCase();
	} catch {
		// No stored account (a key passed in code, nothing initialised): the
		// lookup throws, and the US default applies.
		stored = undefined;
	}
	return stored && stored in HONEYBADGER_HOSTS
		? (stored as HoneybadgerRegion)
		: 'us';
}

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged as a whole: a fault carries the
 * error message and an affected user can be an email address, so `log` picks
 * the fields that are safe to keep.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: HoneybadgerContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: each caller passes its endpoint's own input type, which the
	// schema in `operation` validates. Core hands the bound endpoint whatever
	// the caller wrote, and core is what types this argument as unknown.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => HoneybadgerRequest,
	options: {
		/**
		 * Builds the value the output schema parses from the response body,
		 * which is undefined when the answer carried none (a 204).
		 */
		shape?: (raw: JsonValue | undefined, parsed: z.output<Input>) => JsonValue;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeHoneybadgerRequest(
		ctx.key,
		toRequest(parsed),
		await resolveRegion(ctx),
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`honeybadger.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Builds the answer for a delete, which Honeybadger documents as a bodyless
 * 204. Anything else is refused rather than reported as a delete: a provider
 * that changed to answer with a body could be saying something else, and a
 * caller told a delete succeeded on no evidence cannot tell that it did not.
 */
export function confirmDeleted<T extends Record<string, string>>(
	raw: JsonValue | undefined,
	ids: T,
): T & { deleted: true } {
	if (raw !== undefined && raw !== null) {
		throw new Error(
			'Expected an empty 204 from Honeybadger, but the answer carried a body.',
		);
	}
	return { ...ids, deleted: true as const };
}
