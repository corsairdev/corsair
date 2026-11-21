import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { PenpotContext } from '..';
import { makePenpotRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the RPC, validates the response, then logs the
 * event. Inputs are not logged because file and comment records carry
 * content; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: PenpotContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => string,
	options: {
		// unknown: the RPC body is whatever the input schema parsed; each
		// operation shapes its own body object.
		body: (parsed: z.output<Input>) => unknown;
		// unknown: raw is the response body. The output schema validates
		// whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = { body: () => undefined },
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const rpcName = toRequest(parsed);
	const raw = await makePenpotRequest(ctx.key, {
		rpcName,
		body: options.body(parsed),
	});
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`penpot.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Shapes a delete-style success. Penpot's delete RPCs answer the remaining
 * collection or a null; the plugin treats any answer as success and echoes
 * the id the caller deleted.
 */
// unknown: raw is the untouched response body; Penpot's delete answers
// vary, so the shaper stays untyped and echoes the caller's id.
export function shapeDeleted(_raw: unknown, parsed: { id: string }): unknown {
	return { id: parsed.id, success: true };
}
