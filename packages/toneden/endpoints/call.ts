import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { ToneDenContext } from '..';
import type { ToneDenRequest } from '../client';
import { makeToneDenRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the response, then logs the
 * event. A link's `social_settings` and a campaign's targeting are not logged;
 * `log` names the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: ToneDenContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => ToneDenRequest,
	options: {
		// unknown: raw is the response body; the output schema validates it.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeToneDenRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`toneden.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Strips the identifier a write carries in the path so it never lands in the
 * body, and drops the unset fields so an update sends only what changed.
 */
export function writeBody(
	parsed: Record<string, unknown>,
	pathKeys: readonly string[],
): Record<string, unknown> {
	const body: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(parsed)) {
		if (pathKeys.includes(key) || value === undefined) continue;
		body[key] = value;
	}
	return body;
}
