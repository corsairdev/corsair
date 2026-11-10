import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { SatisMeterContext } from '..';
import type { SatisMeterRequest } from '../client';
import {
	makeSatisMeterRequest,
	parseJsonBody,
	SATISMETER_API_V3,
} from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/** What an endpoint supplies: everything but the base, which defaults to v3. */
export type RequestPlan = Omit<SatisMeterRequest, 'base'> & { base?: string };

/**
 * Validates the input, sends the request, shapes and parses the answer, then
 * logs the event.
 *
 * The API wraps every read in an envelope — `{ data }` for one object,
 * `{ data, page }` for a page of them — so `shape` receives the parsed envelope
 * and decides what the output schema sees. Unwrapping here rather than in a
 * `.transform()` keeps `data` and `page` visible in the generated reference.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: SatisMeterContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => RequestPlan,
	options: {
		// unknown: the shaped value is handed straight to the output schema.
		shape: (envelope: Envelope, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const text = await makeSatisMeterRequest(ctx.key, {
		base: SATISMETER_API_V3,
		...toRequest(parsed),
	});
	const envelope = readEnvelope(text);
	const result = operation.output.parse(options.shape(envelope, parsed));

	await logEventFromContext(
		ctx,
		`satismeter.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * The `{ data }` and `{ data, page }` wrapper every v3 read answers with.
 *
 * unknown: the two members hold a project, a survey array, a page of responses
 * and a statistics object depending on the route, so no single type describes
 * them; each endpoint's output schema is what types the value.
 */
export type Envelope = { data?: unknown; page?: unknown };

/**
 * Reads the envelope out of a successful answer. A read that answers without
 * `data` is a shape the API does not document, so it throws here rather than
 * letting each endpoint invent an empty result.
 */
export function readEnvelope(text: string): Envelope {
	const parsed = parseJsonBody(text);
	if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
		throw new Error(
			`SatisMeter answered with a body that is not an object: ${text.slice(0, 120)}`,
		);
	}
	return parsed as Envelope;
}
