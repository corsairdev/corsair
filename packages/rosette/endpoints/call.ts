import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { RosetteContext } from '..';
import type { RosetteRequest } from '../client';
import { makeRosetteRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response, then
 * logs the event.
 *
 * Inputs are logged only through `log`: every analysis takes the caller's text,
 * which may be a support ticket, a review or a document, so only counts and labels
 * are logged. The text itself never is.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: RosetteContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => RosetteRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeRosetteRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`rosette.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * The body an analysis sends: only the fields the caller set, so Rosette's own
 * defaults apply rather than nulls.
 */
export function documentBody(parsed: {
	content?: string;
	contentUri?: string;
	language?: string;
	profileId?: string;
}): Record<string, string | undefined> {
	return {
		content: parsed.content,
		contentUri: parsed.contentUri,
		language: parsed.language,
		profileId: parsed.profileId,
	};
}

/** The query an analysis sends: just the profile, which rides in the query. */
export function documentQuery(parsed: { profileId?: string }): {
	profileId: string | undefined;
} {
	return { profileId: parsed.profileId };
}
