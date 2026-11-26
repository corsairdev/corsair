import { asRecord, logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import type { z } from 'zod';
import type { LinkhutContext } from '..';
import type { LinkhutRequest } from '../client';
import { linkhutApiError, makeLinkhutRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are never logged: urls, tags and descriptions
 * are the user's bookmarks, so each operation logs counts and paging only.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: LinkhutContext,
	operation: { event: string; input: Input; output: Output },
	rawInput: unknown, // unknown: raw caller input; the input schema parses it below.
	toRequest: (parsed: z.output<Input>) => LinkhutRequest,
	options: {
		shape?: (
			raw: unknown, // unknown: the response body, unvalidated.
			parsed: z.output<Input>,
			request: LinkhutRequest,
		) => unknown; // unknown: the shaped value, which the output schema parses next.
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
		/** The body to use instead when linkhut answers 404 for this input.
		 * Returning undefined lets the 404 through. */
		onNotFound?: (parsed: z.output<Input>) => unknown; // unknown: a stand-in body, parsed by the output schema like a real one.
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const req = toRequest(parsed);
	let raw: unknown; // unknown: the response body, unvalidated.
	try {
		raw = await makeLinkhutRequest(ctx.key, req);
	} catch (error) {
		const fallback =
			error instanceof ApiError && error.status === 404
				? options.onNotFound?.(parsed)
				: undefined;
		if (fallback === undefined) throw error;
		raw = fallback;
	}
	const shaped = options.shape ? options.shape(raw, parsed, req) : raw;
	const result = operation.output.parse(shaped);

	await logEventFromContext(
		ctx,
		`linkhut.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * `requireDone<B>(event: string): (raw: B, parsed: unknown, request: LinkhutRequest) => B`
 *
 * Shape for the four operations that answer `{ "result_code": "done" }`.
 * Returns the body unchanged when linkhut says `done`. Otherwise throws core's
 * `ApiError` with status 200 (the status linkhut sent) and the body, because
 * linkhut reports a failed write as `{"result_code":"something went wrong"}`
 * at HTTP 200: adding a url that is already saved, updating or deleting one
 * that is not.
 */
export function requireDone<B>(event: string): (
	raw: B,
	parsed: unknown, // unknown: the parsed input, not read here.
	request: LinkhutRequest,
) => B {
	return (raw, _parsed, request) => {
		const result = asRecord(raw)?.result_code;
		if (result === 'done') return raw;
		const failed = typeof result === 'string' && result ? result : undefined;
		throw linkhutApiError(
			request,
			{ status: 200, statusText: 'OK', body: raw },
			failed
				? `Linkhut ${event} failed: ${failed}`
				: `Linkhut ${event} did not answer "done"`,
			false,
		);
	};
}
