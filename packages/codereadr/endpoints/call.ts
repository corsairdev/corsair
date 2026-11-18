import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { CodereadrContext } from '..';
import type { CodereadrParams, XmlRecord } from '../client';
import { makeCodereadrRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged: they carry usernames, passwords
 * and database contents, so `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: CodereadrContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toParams: (parsed: z.output<Input>) => CodereadrParams,
	options: {
		shape: (root: XmlRecord, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
		/**
		 * Set for reads and for upserts the provider defines as idempotent.
		 * Everything else is left unsafe, so a transient provider failure is not
		 * replayed onto an operation that may already have been applied.
		 */
		replaySafe?: boolean;
	},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const root = await makeCodereadrRequest(ctx.key, toParams(parsed), {
		replaySafe: options.replaySafe,
	});
	const result = operation.output.parse(options.shape(root, parsed));

	await logEventFromContext(
		ctx,
		`codereadr.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Joins a list of IDs into the comma-separated string CodeREADr accepts, and
 * passes the `all` keyword through unchanged.
 */
export function idList(
	value: readonly number[] | 'all' | undefined,
): string | undefined {
	if (value === undefined) return undefined;
	if (value === 'all') return 'all';
	return value.join(',');
}

/** CodeREADr reads a boolean variable as `1` or `0`. */
export function flag(value: boolean | undefined): number | undefined {
	if (value === undefined) return undefined;
	return value ? 1 : 0;
}
