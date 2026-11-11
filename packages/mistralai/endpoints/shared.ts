import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { MistralAiRequestOptions } from '../client';
import { MistralAiAPIError, makeMistralAiRequest } from '../client';
import type { MistralAiContext } from '../index';

type CallOptions<S extends z.ZodType> = MistralAiRequestOptions & {
	/** Schema the response is parsed with before it is returned. */
	output: S;
	/** Operation name for the event log, for example `models.list`. */
	event: string;
	/**
	 * What the event log keeps: ids and model names only, never prompts,
	 * messages or file content.
	 */
	logged?: Record<string, string | number | boolean | undefined>;
};

/** Sends one request, parses the answer with `output`, logs the call. */
export async function callMistralAi<S extends z.ZodType>(
	ctx: MistralAiContext,
	endpoint: string,
	{ output, event, logged = {}, ...request }: CallOptions<S>,
): Promise<z.output<S>> {
	// unknown: the raw JSON, until `output` parses it.
	const raw = await makeMistralAiRequest<unknown>(endpoint, ctx.key, request);
	const result = output.parse(raw);
	await logEventFromContext(ctx, `mistralai.${event}`, logged, 'completed');
	return result;
}

/** For operations Mistral answers with 204 No Content. */
export async function callMistralAiNoContent(
	ctx: MistralAiContext,
	endpoint: string,
	{ event, logged = {}, ...request }: Omit<CallOptions<z.ZodType>, 'output'>,
): Promise<{ success: true }> {
	// unknown: a 204 has no body to read.
	await makeMistralAiRequest<unknown>(endpoint, ctx.key, request);
	await logEventFromContext(ctx, `mistralai.${event}`, logged, 'completed');
	return { success: true };
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
		throw new MistralAiAPIError(`${field} is not valid base64.`);
	}
	const bytes = Buffer.from(unpadded, 'base64');
	if (bytes.length === 0) {
		throw new MistralAiAPIError(`${field} decodes to an empty file.`);
	}
	return new Uint8Array(bytes);
}
