import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { VectorshiftContext } from '..';
import type { VectorshiftRequest } from '../client';
import { makeVectorshiftRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event.
 *
 * A VectorShift 200 can still say `status: 'failed'`, which is a real failure
 * that would otherwise look like an empty success, so it is raised here as an
 * error rather than returned.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: VectorshiftContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => VectorshiftRequest,
	options: {
		/**
		 * unknown: raw is the response body; the output schema validates what
		 * this returns.
		 */
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeVectorshiftRequest(ctx.key, toRequest(parsed));
	assertSucceeded(raw, operation.event);
	const shaped = options.shape ? options.shape(raw, parsed) : raw;
	const result = operation.output.parse(shaped);

	await logEventFromContext(
		ctx,
		`vectorshift.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * A `failed` status arrives with HTTP 200, so it has to be turned into an error
 * explicitly. The `error` field says why, when the route includes one.
 */
export function assertSucceeded(
	// unknown: the raw body, read only for `status` and `error`.
	raw: unknown,
	operation: string,
): void {
	if (typeof raw !== 'object' || raw === null) return;
	const record = raw as { status?: unknown; error?: unknown };
	if (record.status !== 'failed') return;
	const detail =
		typeof record.error === 'string' && record.error.length > 0
			? record.error
			: 'no reason given';
	throw new VectorshiftRunFailedError(operation, detail);
}

/** A 200 response whose body reported `status: 'failed'`. */
export class VectorshiftRunFailedError extends Error {
	constructor(
		readonly operation: string,
		readonly detail: string,
	) {
		super(`VectorShift reported a failed ${operation}: ${detail}`);
		this.name = 'VectorshiftRunFailedError';
	}
}
