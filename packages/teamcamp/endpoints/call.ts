import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { TeamcampContext } from '..';
import type { TeamcampRequest } from '../client';
import { makeTeamcampRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the answer.
 *
 * Teamcamp's list endpoints answer a bare array, so `shape` wraps it under a
 * named key before the output schema sees it. A delete answers a bare string.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: TeamcampContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => TeamcampRequest,
	options: {
		// unknown: `raw` is the provider's answer, before the output schema runs.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	// unknown: the body is a bare array, an object, or a string depending on the
	// operation; each output schema is what validates it.
	const raw = await makeTeamcampRequest<unknown>(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`teamcamp.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Reads a bare-array answer into `{ items }`. A body that is not an array is
 * reported rather than mapped to an empty list: a page of nothing looks like
 * data, and an endpoint that silently stopped working would be invisible.
 */
// unknown: `raw` is the provider's answer before the endpoint's output schema
// runs, and `unknown[]` is what this returns: the element shapes differ per
// resource, so naming one here would be wrong for every other caller.
export function asArray(raw: unknown, path: string): unknown[] {
	if (!Array.isArray(raw)) {
		throw new Error(
			`Teamcamp answered ${path} with ${typeof raw}, not an array`,
		);
	}
	return raw;
}
