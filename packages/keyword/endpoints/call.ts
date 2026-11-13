import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { KeywordContext } from '..';
import type { KeywordRequest } from '../client';
import { makeKeywordRequest, stripProjectAuth } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event.
 *
 * The project's `auth` key and the account's `api_token` are stripped from
 * every result, at any depth: Keyword returns them inside project, keyword and
 * user resources, and they are credentials whose only home is the connection.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: KeywordContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => KeywordRequest,
	options: {
		// unknown: raw is the response body. The output schema validates
		// whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = stripProjectAuth(
		await makeKeywordRequest(ctx.key, toRequest(parsed)),
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`keyword.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * A JSON:API body wraps the attributes in `{ data: { type, attributes } }`, so
 * the operations build it here rather than leaving the shape to each caller.
 */
// unknown: the attribute values were validated by the operation's input schema,
// and each resource has its own attribute set.
export function resourceBody(
	type: string,
	attributes: Record<string, unknown>,
): { data: { type: string; attributes: Record<string, unknown> } } {
	return {
		data: {
			type,
			attributes: Object.fromEntries(
				Object.entries(attributes).filter(([, value]) => value !== undefined),
			),
		},
	};
}

/** A list of resources, which the keyword add route takes. */
// unknown: same as resourceBody.
export function resourcesBody(
	type: string,
	items: Record<string, unknown>[],
): { data: { type: string; attributes: Record<string, unknown> }[] } {
	return {
		data: items.map((attributes) => ({
			type,
			attributes: Object.fromEntries(
				Object.entries(attributes).filter(([, value]) => value !== undefined),
			),
		})),
	};
}

/** Drops the keys whose value is undefined, for a body built by hand. */
// unknown: an attribute map per resource type, validated by the input schema.
export function dropUndefined(
	value: Record<string, unknown>,
): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(value).filter(([, entry]) => entry !== undefined),
	);
}
