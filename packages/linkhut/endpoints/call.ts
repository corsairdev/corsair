import { asRecord, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { LinkhutContext } from '..';
import type { LinkhutRequest } from '../client';
import { LinkhutAPIError, makeLinkhutRequest } from '../client';

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
		) => unknown; // unknown: the shaped value, which the output schema parses next.
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeLinkhutRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`linkhut.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * `requireDone<B>(event: string): (raw: B) => B`
 *
 * Shape for the four operations that answer `{ "result_code": "done" }`.
 * Returns the body unchanged when linkhut says `done`. Throws a
 * `LinkhutAPIError` when `result_code` holds anything else, with `code` set to
 * linkhut's own text, because the docs show a failure as a body
 * (`{"result_code":"something went wrong"}`) and not as an error status.
 */
export function requireDone<B>(event: string): (raw: B) => B {
	return (raw) => {
		const result = asRecord(raw)?.result_code;
		if (result === 'done') return raw;
		const failed = typeof result === 'string' && result ? result : undefined;
		throw new LinkhutAPIError(
			failed
				? `Linkhut ${event} failed: ${failed}`
				: `Linkhut ${event} did not answer "done"`,
			// makeLinkhutRequest resolves only on a 2xx. Without a status the
			// error would read as a transport failure.
			{ status: 200, code: failed, replayable: false, method: 'GET' },
		);
	};
}
