import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { MotionContext } from '..';
import { makeMotionRequest } from '../client';
import type { MotionEndpointInputs, MotionEndpointOutputs } from './types';
import {
	MotionEndpointInputSchemas,
	MotionEndpointOutputSchemas,
} from './types';

type EndpointName = keyof MotionEndpointInputs;
type Operation<T extends EndpointName> = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: (input: MotionEndpointInputs[T]) => string;
	query?: (
		input: MotionEndpointInputs[T],
	) => Record<string, string | number | boolean | string[] | undefined>;
	// Bodies vary by endpoint; each concrete input schema validates its known provider fields.
	body?: (input: MotionEndpointInputs[T]) => Record<string, unknown>;
	void?: boolean;
};

export const pathValue = (value: string | number) =>
	encodeURIComponent(String(value));
// Input objects differ by endpoint; the helper only removes keys and leaves
// each field value opaque rather than assuming a single request-body shape.
export const omit = <T extends Record<string, unknown>>(
	input: T,
	keys: readonly string[],
) =>
	Object.fromEntries(
		Object.entries(input).filter(([key]) => !keys.includes(key)),
	) as Record<string, unknown>; // Removing path fields leaves the schema-validated JSON request body.

export function define<T extends EndpointName>(
	name: T,
	operation: Operation<T>,
): CorsairEndpoint<
	MotionContext,
	MotionEndpointInputs[T],
	MotionEndpointOutputs[T]
> {
	return async (ctx, rawInput) => {
		// The indexed schema and indexed endpoint input are correlated by `name`, but TypeScript
		// cannot preserve that relationship through a generic indexed lookup.
		const input = MotionEndpointInputSchemas[name].parse(
			rawInput,
		) as MotionEndpointInputs[T];
		const response = await makeMotionRequest<MotionEndpointOutputs[T]>(
			operation.path(input),
			ctx.key,
			{
				method: operation.method,
				query: operation.query?.(input),
				body: operation.body?.(input),
			},
		);
		const result = operation.void
			? undefined
			: MotionEndpointOutputSchemas[name].parse(response);
		await logEventFromContext(
			ctx,
			`motion.${name}`,
			{ operation: name },
			'completed',
		);
		// The same indexed-schema limitation applies after the output schema has parsed the response.
		return result as MotionEndpointOutputs[T];
	};
}
