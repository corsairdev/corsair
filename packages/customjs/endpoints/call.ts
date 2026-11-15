import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { CustomjsContext } from '..';
import type { CustomjsRequest } from '../client';
import {
	makeCustomjsBinaryRequest,
	makeCustomjsJsonRequest,
	makeCustomjsTextRequest,
} from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * CustomJS answers the same host with JSON, text or file bytes depending on the
 * route, so the caller names the reader instead of decoding whatever arrived.
 *
 * The JSON readers return `object`: a parsed JSON body cannot be a bare
 * primitive here, because every route this reads answers an object or an array
 * (the array is the page list).
 */
const READERS = {
	/** A JSON object body. A 2xx that is not JSON throws. */
	json: (apiKey: string, request: CustomjsRequest) =>
		makeCustomjsJsonRequest<object>(apiKey, request),
	/** Inline JavaScript output, which always arrives as `text/plain`. */
	text: (apiKey: string, request: CustomjsRequest) =>
		makeCustomjsTextRequest(apiKey, request),
	/** A PDF or PNG. */
	binary: (apiKey: string, request: CustomjsRequest) =>
		makeCustomjsBinaryRequest(apiKey, request),
	/** A page route, which lives on the pages host. */
	pages: (apiKey: string, request: CustomjsRequest) =>
		makeCustomjsJsonRequest<object>(apiKey, request, { host: 'pages' }),
} as const;

export type ReaderName = keyof typeof READERS;

/**
 * Validates the input, sends the request, validates the response, then logs the
 * event.
 *
 * `replayable` is set per operation rather than derived from the HTTP method:
 * every CustomJS call is a POST, so a render (safe to repeat) and a page
 * creation (not) look identical from the outside. It rides on the request so the
 * error handlers can read it back.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: CustomjsContext,
	operation: {
		event: string;
		input: Input;
		output: Output;
		reader: ReaderName;
		replayable: boolean;
	},
	/**
	 * Raw caller input. The schema decides what is acceptable, so anything else
	 * arriving must reject rather than be coerced.
	 */
	rawInput: unknown, // unknown: the operation's input schema validates it below
	toRequest: (parsed: z.output<Input>) => Omit<CustomjsRequest, 'replayable'>,
	options: {
		/**
		 * Turns the raw body into the output schema's input shape. The readers hand
		 * back an object, a string or a file, and only the endpoint knows which.
		 */
		shape?: (raw: object | string, parsed: z.output<Input>) => object;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const request: CustomjsRequest = {
		...toRequest(parsed),
		replayable: operation.replayable,
	};
	const raw = await READERS[operation.reader](ctx.key, request);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`customjs.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
