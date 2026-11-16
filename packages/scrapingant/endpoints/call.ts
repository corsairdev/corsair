import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { ScrapingAntContext } from '..';
import type { ScrapingAntQuery, ScrapingAntRawResponse } from '../client';
import { makeScrapingAntRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes the answer into the output
 * schema's shape and parses it, then logs the event.
 *
 * `shape` receives the whole raw response, not just the body, because the
 * target page's status and the credit cost live in response headers beside the
 * content. Deriving them here rather than inside a `.transform()` keeps them
 * visible in the generated API reference.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: ScrapingAntContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toQuery: (parsed: z.output<Input>) => ScrapingAntQuery,
	options: {
		path: string;
		// unknown: the shaped value is handed straight to the output schema.
		shape: (raw: ScrapingAntRawResponse, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeScrapingAntRequest(ctx.key, options.path, {
		query: toQuery(parsed),
	});
	const result = operation.output.parse(options.shape(raw, parsed));

	await logEventFromContext(
		ctx,
		`scrapingant.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
