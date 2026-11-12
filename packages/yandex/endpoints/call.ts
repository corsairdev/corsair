import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { YandexContext } from '..';
import type { YandexRequest } from '../client';
import { makeYandexRequest, YandexAPIError } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/** Retries for one detect passage, matching the rate-limit handler's count. */
const PASSAGE_RETRIES = 3;

/**
 * Sends one detect passage, retrying a rate limit or a 5xx in place. A failure
 * that reaches Corsair's retry replays the whole endpoint, which would send
 * every earlier passage again, so a long batch could keep spending its quota
 * on the same first passages. Other errors are thrown at once.
 *
 * unknown: the response body, which the caller's output schema validates.
 */
async function sendPassage(
	key: string,
	request: YandexRequest,
): Promise<unknown> {
	for (let attempt = 0; ; attempt++) {
		try {
			return await makeYandexRequest(key, request);
		} catch (error) {
			const retryable =
				error instanceof YandexAPIError &&
				(error.isResourceExhausted || (error.status ?? 0) >= 500);
			if (!retryable || attempt >= PASSAGE_RETRIES) throw error;
			const wait = error.retryAfter ?? 1000 * 2 ** attempt;
			await new Promise((resolve) => setTimeout(resolve, wait));
		}
	}
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event.
 *
 * The text being translated is the caller's content, so `log` records how much
 * was sent and which languages, never the text itself.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: YandexContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => YandexRequest,
	options: {
		/**
		 * Set when the operation is one request per `texts` entry: the request is
		 * sent once per passage and the answers are collected into one detection
		 * list, in the order they were sent.
		 */
		detectEach?: boolean;
		// unknown: raw is the response body. The output schema validates
		// whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});

	if (options.detectEach) {
		const texts = (parsed as { texts?: string[] }).texts ?? [];
		const detections: { languageCode: string }[] = [];
		for (const text of texts) {
			// A single passage per request, which is what the route documents.
			const base = toRequest(parsed);
			const raw = await sendPassage(ctx.key, {
				...base,
				body: { ...(base.body as object), text },
			});
			const shaped = options.shape?.(raw, parsed) as
				| { detections?: { languageCode: string }[] }
				| undefined;
			const found = shaped?.detections?.[0];
			if (found) detections.push(found);
		}
		const collected = operation.output.parse({ detections });
		await logEventFromContext(
			ctx,
			`yandex.${operation.event}`,
			options.log?.(parsed, collected) ?? {},
			'completed',
		);
		return collected;
	}

	const raw = await makeYandexRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`yandex.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
