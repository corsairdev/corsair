import { asRecord, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { KanbanizeContext } from '..';
import type { KanbanizeRequest } from '../client';
import { makeKanbanizeRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * The subdomain Businessmap serves this account from. It is a per-account
 * credential field rather than a plugin option, so the same integration can
 * serve several customers.
 */
export async function resolveSubdomain(ctx: KanbanizeContext): Promise<string> {
	const fromOption = ctx.options.subdomain;
	if (fromOption) return fromOption;
	const stored = await ctx.keys.get_subdomain();
	return stored ?? '';
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Card descriptions and comments are not logged, so `log`
 * picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: KanbanizeContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => KanbanizeRequest,
	options: {
		// unknown: raw is the response body, undefined for a 204. The output
		// schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const subdomain = await resolveSubdomain(ctx);
	const raw = await makeKanbanizeRequest(ctx.key, subdomain, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`kanbanize.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * A delete answers 204 with no body, so there is nothing to parse. The result
 * states what the caller asked for, which is all Kadoa-shaped providers can
 * offer; a 404 or a 403 still throws.
 */
export function deletedResult(): { success: true } {
	return { success: true };
}

/**
 * A single-resource GET or PATCH answers with the record but without its own
 * ID (`GET /boards/{board_id}` returns `{ data: { name, ... } }`), so the ID the
 * caller asked about is put back. An ID the response does carry wins.
 */
// unknown: raw is the response body before the output schema checks it.
export function withId(raw: unknown, key: string, id: number): unknown {
	const outer = asRecord(raw);
	const data = asRecord(outer?.data);
	if (!outer || !data) return raw;
	return { ...outer, data: { [key]: id, ...data } };
}
