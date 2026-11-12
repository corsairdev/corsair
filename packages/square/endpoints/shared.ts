import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { SquareRequestOptions } from '../client';
import { makeSquareRequest, SquareAPIError } from '../client';
import type { SquareContext } from '../index';

type CallOptions<S extends z.ZodType> = Omit<
	SquareRequestOptions,
	'environment'
> & {
	/** Schema the response is parsed with before it is returned. */
	output: S;
	/** Operation name for the event log, for example `payments.create`. */
	event: string;
	/**
	 * What the event log keeps: ids and sizes only, never customer details,
	 * card data or file content.
	 */
	logged?: Record<string, string | number | boolean | undefined>;
};

/**
 * Sends one request to Square, parses the answer with `output` and logs the
 * call. An answer with no body is parsed as `{}`, so every path goes through
 * the output schema.
 */
export async function callSquare<S extends z.ZodType>(
	ctx: SquareContext,
	endpoint: string,
	{ output, event, logged = {}, ...request }: CallOptions<S>,
): Promise<z.output<S>> {
	// unknown: the raw JSON, until `output` parses it.
	const raw = await makeSquareRequest<unknown>(endpoint, ctx.key, {
		...request,
		environment: ctx.options.environment,
	});
	const result = output.parse(raw ?? {});
	await logEventFromContext(ctx, `square.${event}`, logged, 'completed');
	return result;
}

/**
 * Decodes standard or URL-safe base64, padded or not. Node's decoder drops
 * an incomplete last group silently, so malformed input is refused here
 * instead of uploading a truncated file.
 */
export function decodeBase64(
	content: string,
	field: string,
): Uint8Array<ArrayBuffer> {
	const data = content
		.replace(/^data:[^,]*;base64,/, '')
		.replace(/\s+/g, '')
		.replace(/-/g, '+')
		.replace(/_/g, '/');
	const unpadded = data.replace(/={1,2}$/, '');
	const padded = data.length !== unpadded.length;
	if (
		!/^[A-Za-z0-9+/]*$/.test(unpadded) ||
		unpadded.length % 4 === 1 ||
		(padded && data.length % 4 !== 0)
	) {
		throw new SquareAPIError(`${field} is not valid base64.`);
	}
	const bytes = Buffer.from(unpadded, 'base64');
	if (bytes.length === 0) {
		throw new SquareAPIError(`${field} decodes to an empty file.`);
	}
	return new Uint8Array(bytes);
}
