import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { SensiboRequest } from '../client';
import { makeSensiboRequest } from '../client';
import type { SensiboContext } from '../context';

export function requireKey(ctx: SensiboContext): string {
	if (!ctx.key) {
		throw new AuthMissingError('sensibo', 'api_key');
	}
	return ctx.key;
}

/**
 * Sends one Sensibo request, parses the response with `output` and logs the
 * operation. Only ids go into the event payload.
 */
export async function callSensibo<S extends z.ZodTypeAny>(
	ctx: SensiboContext,
	operation: string,
	req: SensiboRequest,
	output: S,
	eventPayload: Record<string, string> = {},
): Promise<z.infer<S>> {
	const key = requireKey(ctx);
	// unknown: the raw reply is untrusted until `output` parses it below.
	const body = await makeSensiboRequest<unknown>(key, req);
	const result = output.parse(body);
	await logEventFromContext(
		ctx,
		`sensibo.${operation}`,
		eventPayload,
		'completed',
	);
	return result;
}
