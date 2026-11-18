import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { LemonSqueezyContext } from '..';
import type { LemonSqueezyRequest } from '../client';
import { makeLemonSqueezyRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, then validates the answer. The
 * operation's own `shape` runs first when the wire answer is not the public
 * one, which is how a delete's bodyless 204 becomes `{ deleted, webhookId }`.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: LemonSqueezyContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => LemonSqueezyRequest,
	options: {
		// unknown: `raw` is the parsed answer, before the output schema runs.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	// unknown: the body is JSON:API, whose shape each endpoint's output schema
	// validates; a concrete type here would duplicate every resource schema.
	const raw = await makeLemonSqueezyRequest<unknown>(
		ctx.key,
		toRequest(parsed),
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`lemonsqueezy.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/** The id of the single resource in a JSON:API document, for a log line. */
export function idOf(
	// unknown: a raw document whose `data.id` this reads without claiming a type.
	raw: unknown,
): string | undefined {
	if (typeof raw !== 'object' || raw === null) return undefined;
	const data = (raw as { data?: unknown }).data;
	if (typeof data !== 'object' || data === null) return undefined;
	const id = (data as { id?: unknown }).id;
	return typeof id === 'string' ? id : undefined;
}
