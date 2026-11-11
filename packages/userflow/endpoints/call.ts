import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { UserflowContext } from '..';
import type { UserflowRequest } from '../client';
import {
	makeUserflowRequest,
	USERFLOW_API_BASE,
	USERFLOW_EU_API_BASE,
} from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * An EU-region environment lives on `api.eu.userflow.com`, and the API key
 * carries no indication of which region issued it, so the region is a plugin
 * option rather than something the client can infer.
 */
export function resolveBase(ctx: UserflowContext): string {
	return ctx.options?.region === 'eu'
		? USERFLOW_EU_API_BASE
		: USERFLOW_API_BASE;
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged wholesale, because `attributes` is
 * free-form and holds personal data; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: UserflowContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => UserflowRequest,
	options: {
		// unknown: raw is the response body. The output schema validates
		// whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeUserflowRequest(
		ctx.key,
		toRequest(parsed),
		resolveBase(ctx),
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`userflow.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
