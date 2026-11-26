import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { MoceanContext, MoceanEndpoints } from '..';
import type { MoceanRequest } from '../client';
import { makeMoceanRequest } from '../client';
import {
	MoceanEndpointInputSchemas as Inputs,
	MoceanEndpointOutputSchemas as Outputs,
} from './types';

type LogFields = Record<string, string | number | boolean | undefined>;
type Key = keyof typeof Inputs & keyof typeof Outputs;

export type EndpointSpec<K extends Key> = {
	/** Event name logged as `mocean.<event>`; the operation path. */
	event: string;
	request: (parsed: z.output<(typeof Inputs)[K]>) => MoceanRequest;
	/**
	 * Turns the response into the output shape; the identity when omitted.
	 * The output schema validates whatever this returns.
	 */
	// unknown: the raw body (or BinaryResponse) before the output schema.
	shape?: (raw: unknown) => unknown;
	/**
	 * Safe fields for the event log. Inputs are not logged: phone numbers,
	 * message text and PINs are personal data.
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
): MoceanEndpoints[K] {
	const run = async (
		ctx: MoceanContext,
		// unknown: raw caller input, parsed below by the input schema.
		rawInput: unknown,
	): Promise<z.output<(typeof Outputs)[K]>> => {
		const parsed = Inputs[key].parse(rawInput ?? {}) as z.output<
			(typeof Inputs)[K]
		>;
		const raw = await makeMoceanRequest(ctx.key, spec.request(parsed));
		const result = Outputs[key].parse(
			spec.shape ? spec.shape(raw) : raw,
		) as z.output<(typeof Outputs)[K]>;

		await logEventFromContext(
			ctx,
			`mocean.${spec.event}`,
			spec.log?.(parsed, result) ?? {},
			'completed',
		);
		return result;
	};
	return run as MoceanEndpoints[K];
}

export const FORM = 'application/x-www-form-urlencoded';
