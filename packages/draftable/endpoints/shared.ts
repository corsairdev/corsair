import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { DraftableRequest } from '../client';
import { makeDraftableRequest } from '../client';
import type { DraftableContext } from '../context';

export function requireKey(ctx: DraftableContext): string {
	if (!ctx.key) {
		throw new AuthMissingError('draftable', 'api_key');
	}
	return ctx.key;
}

/**
 * Sends one Draftable request, parses the response with `output` and logs the
 * operation. Only ids go into the event payload.
 */
export async function callDraftable<S extends z.ZodTypeAny>(
	ctx: DraftableContext,
	operation: string,
	req: DraftableRequest,
	output: S,
	eventPayload: Record<string, string | number> = {},
): Promise<z.infer<S>> {
	const key = requireKey(ctx);
	// unknown: the raw reply is untrusted until `output` parses it below.
	const body = await makeDraftableRequest<unknown>(key, req);
	const result = output.parse(body);
	await logEventFromContext(
		ctx,
		`draftable.${operation}`,
		eventPayload,
		'completed',
	);
	return result;
}
