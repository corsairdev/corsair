import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { CloudConvertContext } from '..';
import type { CloudConvertRequest } from '../client';
import {
	DEFAULT_CLOUDCONVERT_SYNC_TIMEOUT_MS,
	makeCloudConvertRequest,
} from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the response and logs the
 * event.
 *
 * The transport response is untrusted wire JSON and is parsed with the output
 * schema below; caller input is typed from the input schema.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: CloudConvertContext,
	operation: { event: string; input: Input; output: Output },
	rawInput: z.input<Input> | undefined,
	toRequest: (
		parsed: z.output<Input>,
	) => CloudConvertRequest | Promise<CloudConvertRequest>,
	options: {
		/** The operations reference lists no auth scope for this discovery route. */
		auth?: 'api-key' | 'none';
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	// The transport response is untrusted wire JSON; the output schema validates it next.
	const request = await toRequest(parsed);
	const rawResponse = await makeCloudConvertRequest<unknown>(
		options.auth === 'none' ? undefined : ctx.key,
		request.host === 'sync'
			? {
					...request,
					timeoutMs:
						ctx.options.syncTimeoutMs ?? DEFAULT_CLOUDCONVERT_SYNC_TIMEOUT_MS,
				}
			: request,
	);
	const result = operation.output.parse(rawResponse);

	await logEventFromContext(
		ctx,
		`cloudconvert.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);

	return result;
}

/** Joins a documented array parameter into its comma-separated wire form. */
export function joinList(
	values: readonly string[] | undefined,
): string | undefined {
	return values?.length ? values.join(',') : undefined;
}
