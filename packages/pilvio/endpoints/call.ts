import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { PilvioContext } from '..';
import type { PilvioRequest } from '../client';
import { makePilvioRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the response, then logs
 * the event. Credentials and passwords are not logged.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: PilvioContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => PilvioRequest,
	options: {
		// unknown: raw is the response body. The output schema validates
		// whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const request = toRequest(parsed);
	// Location-scoped routes take the slug after /v1 (see located() in types).
	// unknown: provider-shaped or untyped until a schema narrows it; no stricter type fits.
	const location = (parsed as { location?: unknown }).location;
	if (typeof location === 'string' && location.length > 0) {
		request.path = request.path.replace(
			/^\/v1\//,
			`/v1/${encodeURIComponent(location)}/`,
		);
	}
	const raw = await makePilvioRequest(ctx.key, request);
	// Some failures arrive as HTTP 200 with {"errors":{"Error":"…"}} (the
	// docs' delete example); they are failures, not results.
	// unknown: provider-shaped or untyped until a schema narrows it; no stricter type fits.
	const errors = (raw as { errors?: unknown } | null)?.errors;
	const businessError =
		typeof errors === 'string'
			? errors
			: // unknown: provider-shaped or untyped until a schema narrows it; no stricter type fits.
				typeof (errors as { Error?: unknown } | undefined)?.Error === 'string'
				? (errors as { Error: string }).Error
				: undefined;
	if (businessError) {
		throw new Error(`Pilvio ${operation.event}: ${businessError}`);
	}
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`pilvio.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
