import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { MoosendContext, MoosendEndpoints } from '..';
import type { MoosendEnvelope, MoosendRequest } from '../client';
import { makeMoosendRequest } from '../client';
import {
	MoosendEndpointInputSchemas as Inputs,
	MoosendEndpointOutputSchemas as Outputs,
} from './types';

type LogFields = Record<string, string | number | boolean | undefined>;
type Key = keyof typeof Inputs & keyof typeof Outputs;

export type EndpointSpec<K extends Key> = {
	/** Event name logged as `moosend.<event>`; the operation path. */
	event: string;
	request: (parsed: z.output<(typeof Inputs)[K]>) => MoosendRequest;
	/**
	 * Turns the envelope's Context into the output shape; the identity when
	 * omitted. The output schema validates whatever this returns.
	 */
	shape?: (
		// unknown: Context is whatever the route returned; the output schema
		// checks it.
		context: unknown,
		envelope: MoosendEnvelope,
	) => unknown;
	/**
	 * Safe fields for the event log. Inputs are not logged, because emails,
	 * names and campaign content are personal data.
	 */
	log?: (
		parsed: z.output<(typeof Inputs)[K]>,
		result: z.output<(typeof Outputs)[K]>,
	) => LogFields;
};

/**
 * Validates the input, sends the request, shapes and validates the
 * response, then logs the event.
 */
export function endpoint<K extends Key>(
	key: K,
	spec: EndpointSpec<K>,
): MoosendEndpoints[K] {
	const run = async (
		ctx: MoosendContext,
		// unknown: raw caller input, parsed below by the input schema.
		rawInput: unknown,
	): Promise<z.output<(typeof Outputs)[K]>> => {
		const parsed = Inputs[key].parse(rawInput ?? {}) as z.output<
			(typeof Inputs)[K]
		>;
		const envelope = await makeMoosendRequest(ctx.key, spec.request(parsed));
		const shaped = spec.shape
			? spec.shape(envelope.context, envelope)
			: envelope.context;
		const result = Outputs[key].parse(shaped) as z.output<(typeof Outputs)[K]>;

		await logEventFromContext(
			ctx,
			`moosend.${spec.event}`,
			spec.log?.(parsed, result) ?? {},
			'completed',
		);
		return result;
	};
	return run as MoosendEndpoints[K];
}

/** For routes that answer `Context: null` on success (Code 0). */
export const success = () => ({ success: true as const });

/** `{ Country: 'NL' }` becomes Moosend's `['Country=NL']`. */
export function customFieldPairs(
	values: Record<string, string | number | boolean> | undefined,
): string[] | undefined {
	if (!values) return undefined;
	return Object.entries(values).map(([name, value]) => `${name}=${value}`);
}

/** Drops undefined keys so optional inputs are not sent as nulls. */
export function compact<T extends Record<string, unknown>>(value: T): T {
	return Object.fromEntries(
		Object.entries(value).filter(([, v]) => v !== undefined),
	) as T;
}
