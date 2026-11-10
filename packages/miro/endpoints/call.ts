import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { MiroContext } from '..';
import type { MiroRequest } from '../client';
import { makeMiroRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event.
 *
 * Miro returns the resource itself rather than wrapping it, so most shaping is
 * identity; the item routes are the exception and wrap their payload in
 * `{ item }` here rather than in a `.transform()`, which the docs generator
 * cannot see.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: MiroContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => MiroRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeMiroRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(options.shape(raw, parsed));

	await logEventFromContext(
		ctx,
		`miro.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/** A board-scoped path segment. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

/** Miro answers a successful delete with a 204, so there is no body to parse. */
export const deleted = { success: true } as const;

/** The board body, with only the fields the caller set. */
export function boardBody(parsed: {
	name?: string;
	description?: string;
	policy?: unknown; // unknown: the parsed policy object, serialized as-is.
	teamId?: string;
	projectId?: string;
}): Record<string, unknown> {
	// unknown: see the parsed parameter. // unknown: the body is assembled then serialized.
	const body: Record<string, unknown> = {}; // unknown: see the return type.
	if (parsed.name !== undefined) body.name = parsed.name;
	if (parsed.description !== undefined) body.description = parsed.description;
	if (parsed.policy !== undefined) body.policy = parsed.policy;
	if (parsed.teamId !== undefined) body.teamId = parsed.teamId;
	if (parsed.projectId !== undefined) body.projectId = parsed.projectId;
	return body;
}

/**
 * The body for an item create or update.
 *
 * Miro nests `content`, `title` and the other type-specific fields under
 * `data`, and position, geometry and parent sit beside it, so the flattened
 * input is regrouped here.
 */
export function itemBody(
	parsed: Record<string, unknown>, // unknown: one helper serves every item kind.
	options: { dataKeys: readonly string[]; includeParent?: boolean } = {
		dataKeys: [],
	},
): Record<string, unknown> {
	// unknown: see the parsed parameter.
	const data: Record<string, unknown> = {}; // unknown: the item kind decides its keys.
	for (const key of options.dataKeys) {
		const value = parsed[key];
		if (value !== undefined) data[key] = value;
	}

	const body: Record<string, unknown> = {}; // unknown: assembled then serialized.
	if (Object.keys(data).length > 0) body.data = data;
	if (parsed.position !== undefined) body.position = parsed.position;
	if (parsed.geometry !== undefined) body.geometry = parsed.geometry;
	if (options.includeParent && parsed.parentId !== undefined) {
		body.parent = { id: parsed.parentId };
	}
	// A style object is grouped already; each caller flattens its own colours
	// into it before calling.
	if (parsed.style !== undefined) body.style = parsed.style;
	return body;
}
