import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { YandexContext } from '..';
import type { YandexRequest } from '../client';
import { makeYandexRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

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
		 * `folderId` is pulled off the parsed input and sent as a header, since
		 * the API scopes a cloud resource to a folder that way.
		 */
		folderId?: (parsed: z.output<Input>) => string | undefined;
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
			const raw = await makeYandexRequest(
				ctx.key,
				{ ...toRequest(parsed), body: { text } },
				options.folderId?.(parsed),
			);
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

	const raw = await makeYandexRequest(
		ctx.key,
		toRequest(parsed),
		options.folderId?.(parsed),
	);
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
