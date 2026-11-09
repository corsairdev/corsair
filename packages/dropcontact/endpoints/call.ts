import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { DropcontactContext } from '..';
import type { DropcontactRequest } from '../client';
import {
	DropcontactAPIError,
	isFailedBody,
	makeDropcontactRequest,
	readReason,
} from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event.
 *
 * Dropcontact names its fields in snake_case and repeats `request_id`,
 * `credits_left` and `hashedInputs` across routes, so each operation's `shape`
 * renames them once, here, rather than leaving callers to remember which route
 * used which spelling. Renaming happens before `parse`, never in a
 * `.transform()`, because the docs generator reads a transform's input side.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: DropcontactContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => DropcontactRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeDropcontactRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(options.shape(raw, parsed));

	await logEventFromContext(
		ctx,
		`dropcontact.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * A 200 that still reports a failure, for the routes where that can only mean
 * a real problem.
 *
 * `enrichment.results` is deliberately excluded: a batch that is still
 * processing answers `success: false` with a reason, which is a normal state
 * for a polled job, so that operation returns it and lets the caller re-poll.
 */
// unknown: the raw response body, narrowed by isFailedBody and readReason.
export function throwIfFailed(body: unknown, status = 200): void {
	if (!isFailedBody(body)) return;
	const reason = readReason(body) ?? 'Dropcontact reported success: false';
	throw new DropcontactAPIError(`Dropcontact ${status}: ${reason}`, {
		status,
		body,
	});
}
