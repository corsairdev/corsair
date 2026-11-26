import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { LobContext, LobEndpoints } from '..';
import type { LobRequest } from '../client';
import { makeLobRequest } from '../client';
import type { LobOperation } from './types';
import {
	LobEndpointInputSchemas as Inputs,
	LobEndpointOutputSchemas as Outputs,
} from './types';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged, because they carry street
 * addresses and recipient names; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: LobContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => LobRequest | Promise<LobRequest>,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeLobRequest(ctx.key, await toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`lob.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

// unknown: any parsed output; only a top-level string `id` is read.
function idOf(result: unknown): LogFields {
	if (result && typeof result === 'object' && 'id' in result) {
		const { id } = result as { id?: unknown };
		if (typeof id === 'string') return { id };
	}
	return {};
}

/**
 * Builds one operation from its registry key: the key picks the input and
 * output schemas, `toRequest` maps the parsed input to the HTTP call. The log
 * keeps only the result's ID unless `log` says otherwise.
 */
export function defineOp<K extends LobOperation>(
	key: K,
	event: string,
	toRequest: (
		parsed: z.output<(typeof Inputs)[K]>,
	) => LobRequest | Promise<LobRequest>,
	options: {
		// unknown: raw response body; see call().
		shape?: (raw: unknown, parsed: z.output<(typeof Inputs)[K]>) => unknown;
	} = {},
): LobEndpoints[K] {
	const endpoint = (ctx: LobContext, input: unknown) =>
		call(
			ctx,
			{ event, input: Inputs[key], output: Outputs[key] },
			input,
			toRequest as (parsed: unknown) => LobRequest | Promise<LobRequest>,
			{
				shape: options.shape as
					| ((raw: unknown, parsed: unknown) => unknown)
					| undefined,
				log: (_, result) => idOf(result),
			},
		);
	// The registry types each key's input and output; the generic call above
	// cannot carry that link through an indexed K, so the cast restores it.
	return endpoint as unknown as LobEndpoints[K];
}

/** Splits the idempotency key off a send's input into its header. */
export function idempotencyHeaders(
	key: string | undefined,
	extra: Record<string, string | undefined> = {},
): Record<string, string> | undefined {
	const headers: Record<string, string> = {};
	if (key) headers['Idempotency-Key'] = key;
	for (const [name, value] of Object.entries(extra)) {
		if (value) headers[name] = value;
	}
	return Object.keys(headers).length > 0 ? headers : undefined;
}
