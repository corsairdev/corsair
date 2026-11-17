import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { SymplaRequest } from '../client';
import { makeSymplaRequest } from '../client';
import type { SymplaContext } from '../context';

export function requireKey(ctx: SymplaContext): string {
	if (!ctx.key) {
		throw new AuthMissingError('sympla', 'api_key');
	}
	return ctx.key;
}

/**
 * Sends one Sympla request, parses the response with `output` and logs the
 * operation. Only ids go into the event payload: never emails, names or
 * ticket data.
 */
export async function callSympla<S extends z.ZodTypeAny>(
	ctx: SymplaContext,
	operation: string,
	req: SymplaRequest,
	output: S,
	eventPayload: Record<string, string> = {},
	// unknown: what an empty 2xx reply (204 No Content) stands for, checked by `output`.
	emptyReply?: unknown,
): Promise<z.infer<S>> {
	const key = requireKey(ctx);
	// unknown: the raw reply is untrusted until `output` parses it below.
	const body = await makeSymplaRequest<unknown>(key, req);
	const empty = body === undefined || body === null || body === '';
	const result = output.parse(
		empty && emptyReply !== undefined ? emptyReply : body,
	);
	await logEventFromContext(
		ctx,
		`sympla.${operation}`,
		eventPayload,
		'completed',
	);
	return result;
}
