import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { KeenContext } from '..';
import type { KeenCredentials, KeenRequest } from '../client';
import { makeKeenRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * The key is `ctx.key`, which the key builder resolved (the plugin option or
 * the account's key) and hooks may have replaced. The project ID comes from
 * the plugin options when given and otherwise from the account credentials.
 */
export async function resolveCredentials(
	ctx: KeenContext,
): Promise<KeenCredentials> {
	const apiKey = ctx.key;
	const projectId =
		ctx.options.projectId ?? (await ctx.keys.get_project_id()) ?? '';
	return { apiKey, projectId };
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. An event body and a filter value are not logged, because
 * either can hold anything the caller recorded.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: KeenContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => KeenRequest,
	options: {
		// unknown: raw is the response body, undefined for a 204. The output
		// schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const credentials = await resolveCredentials(ctx);
	const raw = await makeKeenRequest(credentials, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`keen.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * A saved query or dataset delete answers 204 with no body, so there is nothing
 * to parse. A 404 or a 403 still throws, so this is only reached on success.
 */
export function deletedResult(): { success: true } {
	return { success: true };
}
