import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { RetentlyContext } from '..';
import type { RetentlyQuery, RetentlyRequest } from '../client';
import { makeRetentlyRequest } from '../client';
import type { RetentlyAttribute } from './types';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Retently reads property filters as bracketed, indexed query keys:
 *
 * ```
 * attributes[0][name]=country&attributes[0][op]=equal&attributes[0][value]=US
 * ```
 *
 * `corsair/http` turns a nested object into `attributes[name]=…`, which is not
 * the documented shape, so the keys are built here already flattened.
 */
export function attributesQuery(
	attributes: RetentlyAttribute[] | undefined,
): RetentlyQuery {
	if (!attributes || attributes.length === 0) return {};
	const query: RetentlyQuery = {};
	attributes.forEach((attribute, index) => {
		query[`attributes[${index}][name]`] = attribute.name;
		query[`attributes[${index}][op]`] = attribute.op;
		const value = attribute.value;
		if (value === undefined) return;
		// A list becomes the repeated-value form the operator `in` expects.
		query[`attributes[${index}][value]`] = Array.isArray(value)
			? value.map((entry) => String(entry)).join(',')
			: typeof value === 'object' && value !== null
				? JSON.stringify(value)
				: String(value);
	});
	return query;
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are logged only through `log`, because customer
 * payloads carry names and email addresses.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: RetentlyContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => RetentlyRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeRetentlyRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`retently.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
