import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { KlazifyContext } from '..';
import type { KlazifyRequest } from '../client';
import { makeKlazifyRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the answer, then logs the
 * event. The target (a URL or an email) is not logged at full length: an email
 * is a person's address, so `log` picks what is safe to keep.
 */
export async function callKlazify<
	Input extends z.ZodType,
	Output extends z.ZodType,
>(
	ctx: KlazifyContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => KlazifyRequest,
	options: {
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeKlazifyRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(raw);

	await logEventFromContext(
		ctx,
		`klazify.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * The body Klazify expects. `refresh` is only sent when the caller set it, so an
 * omitted value stays the service's default rather than becoming `false`.
 */
export function targetBody(target: {
	url?: string;
	email?: string;
	refresh?: boolean;
}): Record<string, string | boolean> {
	const body: Record<string, string | boolean> = {};
	if (target.url !== undefined) body.url = target.url;
	if (target.email !== undefined) body.email = target.email;
	if (target.refresh !== undefined) body.refresh = target.refresh;
	return body;
}
