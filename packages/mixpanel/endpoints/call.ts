import type { CorsairEndpoint, EndpointMetaEntry } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { MixpanelContext } from '..';
import type { MixpanelCredentials, MixpanelRequest } from '../client';
import { makeMixpanelRequest, parseMixpanelKey } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

export type MixpanelOperationSpec<
	Input extends z.ZodType,
	Output extends z.ZodType,
> = {
	/** The dotted path the operation is registered under. */
	name: string;
	input: Input;
	output: Output;
	meta: EndpointMetaEntry;
	toRequest: (
		parsed: z.output<Input>,
		credentials: MixpanelCredentials,
	) => MixpanelRequest;
	// unknown: raw is the response body (JSON, or text for export and /track).
	// The output schema validates whatever this returns.
	shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
	/** Safe fields for the event log. Inputs are never logged whole. */
	log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
};

export type MixpanelOperation<
	Input extends z.ZodType,
	Output extends z.ZodType,
> = CorsairEndpoint<MixpanelContext, z.input<Input>, z.output<Output>> & {
	readonly schemas: { input: Input; output: Output };
	readonly meta: EndpointMetaEntry;
};

/**
 * Declares one operation: validates the input, builds the request from the
 * packed credentials in `ctx.key`, sends it, shapes and validates the
 * response, then logs the event. Schemas and metadata ride on the returned
 * function so index.ts registers each operation from one definition.
 */
export function op<Input extends z.ZodType, Output extends z.ZodType>(
	spec: MixpanelOperationSpec<Input, Output>,
): MixpanelOperation<Input, Output> {
	const endpoint = async (
		ctx: MixpanelContext,
		// unknown: raw caller input, parsed below by the operation's input schema.
		rawInput: unknown,
	): Promise<z.output<Output>> => {
		const parsed = spec.input.parse(rawInput ?? {});
		const credentials = parseMixpanelKey(ctx.key);
		const raw = await makeMixpanelRequest(
			credentials,
			spec.toRequest(parsed, credentials),
		);
		const result = spec.output.parse(
			spec.shape ? spec.shape(raw, parsed) : raw,
		);
		await logEventFromContext(
			ctx,
			`mixpanel.${spec.name}`,
			spec.log?.(parsed, result) ?? {},
			'completed',
		);
		return result;
	};
	return Object.assign(endpoint, {
		schemas: { input: spec.input, output: spec.output },
		meta: spec.meta,
	}) as MixpanelOperation<Input, Output>;
}
