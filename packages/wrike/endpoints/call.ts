import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { WrikeContext } from '..';
import type { WrikeRequest } from '../client';
import { makeWrikeRequest, WRIKE_API_BASE, WRIKE_HOSTS } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * An account lives on exactly one of Wrike's three hosts, and nothing in a
 * token says which, so the host is a plugin option.
 */
export function resolveBase(ctx: WrikeContext): string {
	const host = ctx.options?.host ?? 'www';
	return `${WRIKE_HOSTS[host] ?? WRIKE_HOSTS.www}/api/v4`;
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Wrike is a work-management system, so a task title and
 * description can name a client or a project, which is why `log` picks fields
 * rather than logging the object.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: WrikeContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => WrikeRequest,
	options: {
		// unknown: raw is the response body. The output schema validates
		// whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeWrikeRequest(
		ctx.key,
		toRequest(parsed),
		resolveBase(ctx),
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`wrike.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/** Exported so the tests can assert the default base without a context. */
export const WRIKE_DEFAULT_BASE = WRIKE_API_BASE;
