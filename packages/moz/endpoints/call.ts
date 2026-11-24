import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { MozContext } from '..';
import { makeMozRequest } from '../client';
import type { MozOperationName } from './manifest';
import { mozMethods } from './manifest';
import { mozInputBuilders, mozOutputBuilders } from './schemas';

type InputBuilders = typeof mozInputBuilders;
type OutputBuilders = typeof mozOutputBuilders;

export type MozInputSchema<N extends MozOperationName> = ReturnType<
	InputBuilders[N]
>;
export type MozOutputSchema<N extends MozOperationName> = ReturnType<
	OutputBuilders[N]
>;

// Schemas are built on first use and cached: 74 operations' schemas cost
// memory every plugin import would otherwise pay (Hub loads every plugin).
const inputCache = new Map<string, z.ZodType>();
const outputCache = new Map<string, z.ZodType>();

export function mozInputSchema<N extends MozOperationName>(
	name: N,
): MozInputSchema<N> {
	let schema = inputCache.get(name);
	if (!schema) {
		schema = mozInputBuilders[name]();
		inputCache.set(name, schema);
	}
	return schema as MozInputSchema<N>;
}

export function mozOutputSchema<N extends MozOperationName>(
	name: N,
): MozOutputSchema<N> {
	let schema = outputCache.get(name);
	if (!schema) {
		schema = mozOutputBuilders[name]();
		outputCache.set(name, schema);
	}
	return schema as MozOutputSchema<N>;
}

/** `{ input, output }` read lazily, the shape core's endpointSchemas expects. */
export function lazySchemas<N extends MozOperationName>(name: N) {
	return {
		get input() {
			return mozInputSchema(name);
		},
		get output() {
			return mozOutputSchema(name);
		},
	};
}

export type MozOperation<N extends MozOperationName> = CorsairEndpoint<
	MozContext,
	z.input<MozInputSchema<N>>,
	z.output<MozOutputSchema<N>>
>;

/**
 * One Moz operation: validates the payload, sends it as `params.data` of the
 * JSON-RPC method, validates the result and logs the method name only
 * (payloads can name a customer's sites or business details).
 */
export function op<N extends MozOperationName>(name: N): MozOperation<N> {
	return async (ctx, input) => {
		const data = mozInputSchema(name).parse(input ?? {});
		const raw = await makeMozRequest(ctx.key, mozMethods[name], data);
		const result = mozOutputSchema(name).parse(raw) as z.output<
			MozOutputSchema<N>
		>;
		await logEventFromContext(
			ctx,
			`moz.${name}`,
			{ method: mozMethods[name] },
			'completed',
		);
		return result;
	};
}
