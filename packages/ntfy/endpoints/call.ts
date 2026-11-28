import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { NtfyContext } from '..';
import type { NtfyRequest, NtfyTarget } from '../client';
import {
	makeNtfyRequest,
	NTFY_API_BASE,
	normalizeNtfyBaseUrl,
} from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * The server a call goes to: the `serverUrl` plugin option, else the
 * account's stored `base_url`, else ntfy.sh. Self-hosted servers serve the
 * same API.
 */
export async function resolveNtfyTarget(ctx: NtfyContext): Promise<NtfyTarget> {
	const fromOptions = ctx.options?.serverUrl?.trim();
	let base = fromOptions;
	if (!base) {
		try {
			base = (await ctx.keys?.get_base_url?.())?.trim() || undefined;
		} catch {
			base = undefined;
		}
	}
	return {
		baseUrl: base ? normalizeNtfyBaseUrl(base) : NTFY_API_BASE,
		key: ctx.key ?? '',
	};
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged because notification bodies can
 * hold personal content; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: NtfyContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => NtfyRequest,
	options: {
		// unknown: raw is the response body (JSON object or NDJSON text), or
		// undefined when there is none. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeNtfyRequest(
		await resolveNtfyTarget(ctx),
		toRequest(parsed),
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`ntfy.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/** One endpoint from a declarative spec, for the routes that need no shaping beyond the schema. */
export function op<Input extends z.ZodType, Output extends z.ZodType>(spec: {
	event: string;
	input: Input;
	output: Output;
	request: (parsed: z.output<Input>) => NtfyRequest;
	shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
	log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
}) {
	const endpoint = (ctx: NtfyContext, input: z.input<Input>) =>
		call(
			ctx,
			{ event: spec.event, input: spec.input, output: spec.output },
			input,
			spec.request,
			{ shape: spec.shape, log: spec.log },
		);
	return Object.assign(endpoint, {
		schemas: { input: spec.input, output: spec.output },
	});
}
