import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { RudderStackTransformationContext } from '..';
import type { RudderStackTransformationRequest } from '../client';
import { makeRudderStackTransformationRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response, then
 * logs the event.
 *
 * Inputs are logged only through `log`: a transformation's body is customer code
 * and a publish can carry test events, so neither is copied into the event log.
 * The callbacks report IDs, names and counts instead.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: RudderStackTransformationContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => RudderStackTransformationRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	// A token is only valid on its workspace's region, so the host comes from the
	// plugin options rather than from anything the caller passes per call.
	const raw = await makeRudderStackTransformationRequest(
		ctx.key,
		ctx.options?.region ?? 'us',
		toRequest(parsed),
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`rudderstacktransform.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/** Encodes a path segment; RudderStack IDs are URL-safe but never assumed so. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}
