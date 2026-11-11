import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { WorksnapsContext } from '..';
import type { WorksnapsRequest } from '../client';
import { makeWorksnapsRequest } from '../client';
import { parseXmlDocument } from '../xml';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the XML request, parses the XML answer into a
 * plain value keyed by its root element, then validates that with the
 * operation's output schema.
 *
 * The intermediate step matters: the API is XML-only, so nothing downstream
 * sees the raw document.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: WorksnapsContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => WorksnapsRequest,
	options: {
		/**
		 * unknown: raw is the response text, or undefined when the body was
		 * empty. It is parsed and converted before the output schema sees it.
		 */
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeWorksnapsRequest(ctx.key, toRequest(parsed));

	// An empty body — a delete, or a 200 with nothing in it — becomes undefined
	// rather than an empty document, so a `shape` can supply what it knows.
	const asText = typeof raw === 'string' ? raw.trim() : '';
	const document = asText.length > 0 ? parseXmlDocument(asText) : undefined;

	const result = operation.output.parse(
		options.shape ? options.shape(document, parsed) : document,
	);

	await logEventFromContext(
		ctx,
		`worksnaps.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
