import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { WatiContext } from '..';
import type { WatiRequest } from '../client';
import { makeWatiRequest, WATI_REGIONS } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * A token only works against its own region's host, and nothing in the token
 * says which that is, so the region is a plugin option.
 */
/**
 * The API host. A dedicated WATI account can be issued its own host, which takes
 * precedence over the regional one, so `apiHost` is honoured first. It is a host
 * only, never a path: the `/api/ext/v3` suffix is added here.
 */
export function resolveBase(ctx: WatiContext): string {
	const custom = ctx.options?.apiHost?.trim().replace(/\/+$/, '');
	if (custom) {
		// A bare host is accepted with or without a scheme.
		const withScheme = /^https?:\/\//i.test(custom)
			? custom
			: `https://${custom}`;
		return `${withScheme}/api/ext/v3`;
	}
	const region = ctx.options?.region ?? 'global';
	const host = WATI_REGIONS[region] ?? WATI_REGIONS.global;
	return `${host}/api/ext/v3`;
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. A contact carries a phone number and custom attributes,
 * so `log` picks the fields rather than logging the object.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: WatiContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => WatiRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeWatiRequest(
		ctx.key,
		toRequest(parsed),
		resolveBase(ctx),
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`wati.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
