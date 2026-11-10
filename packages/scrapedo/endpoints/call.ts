import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { ScrapeDoContext } from '..';
import type { ScrapeDoRequest } from '../client';
import { makeScrapeDoRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and parses the answer, then
 * logs the event. `shape` receives the raw text and the status so an endpoint
 * can read either; the scrape surface reports the target's status beside the
 * body rather than only inside it.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: ScrapeDoContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => ScrapeDoRequest,
	options: {
		// unknown: the shaped value is handed straight to the output schema.
		shape: (
			answer: { body: string; status: number; contentType?: string },
			parsed: z.output<Input>,
		) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const answer = await makeScrapeDoRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(options.shape(answer, parsed));

	await logEventFromContext(
		ctx,
		`scrapedo.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * The options both scrape operations send, under the provider's own names. An
 * unset option is dropped rather than sent as `undefined` or as a default, so
 * the provider's own defaults apply.
 */
export function scrapeQuery(input: {
	url: string;
	super?: boolean;
	geoCode?: string;
	regionalGeoCode?: string;
	sessionId?: number;
	setCookies?: string;
	disableRedirection?: boolean;
	timeout?: number;
	disableRetry?: boolean;
	render?: boolean;
	device?: string;
	width?: number;
	height?: number;
	blockResources?: boolean;
	transparentResponse?: boolean;
}): Record<string, string | number | boolean | undefined> {
	return {
		url: input.url,
		super: input.super,
		geoCode: input.geoCode,
		regionalGeoCode: input.regionalGeoCode,
		sessionId: input.sessionId,
		setCookies: input.setCookies,
		disableRedirection: input.disableRedirection,
		timeout: input.timeout,
		disableRetry: input.disableRetry,
		render: input.render,
		device: input.device,
		width: input.width,
		height: input.height,
		blockResources: input.blockResources,
		transparentResponse: input.transparentResponse,
	};
}
