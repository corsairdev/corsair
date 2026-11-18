import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { ParsehubRequest } from '../client';
import { makeParsehubRequest } from '../client';
import type { ParsehubContext } from '../context';

export function requireKey(ctx: ParsehubContext): string {
	if (!ctx.key) {
		throw new AuthMissingError('parsehub', 'api_key');
	}
	return ctx.key;
}

/**
 * Sends one ParseHub request, parses the response with `output` and logs the
 * operation. Only tokens and offsets go into the event payload.
 */
export async function callParsehub<S extends z.ZodTypeAny>(
	ctx: ParsehubContext,
	operation: string,
	req: ParsehubRequest,
	output: S,
	eventPayload: Record<string, string | number> = {},
): Promise<z.infer<S>> {
	const key = requireKey(ctx);
	// unknown: the raw reply is untrusted until `output` parses it below.
	const body = await makeParsehubRequest<unknown>(key, req);
	const result = output.parse(body);
	await logEventFromContext(
		ctx,
		`parsehub.${operation}`,
		eventPayload,
		'completed',
	);
	return result;
}

export function flag(value: boolean | undefined): number | undefined {
	return value === undefined ? undefined : value ? 1 : 0;
}
