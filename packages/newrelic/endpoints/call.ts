import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { NewrelicContext } from '..';
import type { NewrelicRegion, NewrelicRequest } from '../client';
import { makeNewrelicRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. `region` picks the data centre and is stripped from the
 * request the endpoint builds.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: NewrelicContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (
		parsed: z.output<Input>,
		region: NewrelicRegion,
	) => NewrelicRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {}) as z.output<Input> & {
		region?: NewrelicRegion;
	};
	const region: NewrelicRegion = parsed.region ?? 'us';
	const raw = await makeNewrelicRequest(
		ctx.key,
		region,
		toRequest(parsed, region),
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`newrelic.${operation.event}`,
		{ region, ...options.log?.(parsed, result) },
		'completed',
	);
	return result;
}
