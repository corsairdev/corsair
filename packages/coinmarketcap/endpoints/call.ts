import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { CoinMarketCapContext } from '..';
import type { CoinMarketCapRequest } from '../client';
import { errorFromEnvelope, makeCoinMarketCapRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/** A comma-separated query value, from the array the input schema declares. */
export function joinCsv(
	values: readonly (string | number)[] | undefined,
): string | undefined {
	return values?.length ? values.join(',') : undefined;
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Each operation's `shape` lifts CoinMarketCap's `data`
 * (an array, or an object keyed by the identifier passed) into a named field,
 * so a caller never has to know which of the two a route chose.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: CoinMarketCapContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => CoinMarketCapRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		// unknown: the response body before the output schema validates it.
		shape: (raw: unknown, parsed: z.output<Input>) => unknown; // unknown: see above.
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeCoinMarketCapRequest(ctx.key, toRequest(parsed));

	// A `/v3` route that does not exist answers HTTP 200 with `error_code 500`,
	// so the envelope is checked before any output schema sees it.
	const envelopeError = errorFromEnvelope(raw);
	if (envelopeError) throw envelopeError;

	const result = operation.output.parse(options.shape(raw, parsed));

	await logEventFromContext(
		ctx,
		`coinmarketcap.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
