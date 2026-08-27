import { logEventFromContext } from 'corsair/core';
import type { ZodType } from 'zod';
import type { PineconeContext, PineconeEndpoints } from '..';
import type { PineconeSurface } from '../client';
import { makePineconeRequest } from '../client';
import type { PineconeEndpointInputs, PineconeEndpointOutputs } from './types';
import { PineconeEndpointOutputSchemas } from './types';

type OperationKey = keyof PineconeEndpointInputs &
	keyof PineconeEndpointOutputs;

type OperationConfig<K extends OperationKey> = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: (input: PineconeEndpointInputs[K]) => string;
	surface?: PineconeSurface;
	body?: (input: PineconeEndpointInputs[K]) => unknown;
	query?: (
		input: PineconeEndpointInputs[K],
	) => Record<
		string,
		string | number | boolean | readonly string[] | undefined
	>;
};

export function definePineconeEndpoint<K extends OperationKey>(
	key: K,
	config: OperationConfig<K>,
): PineconeEndpoints[K] {
	return (async (ctx: PineconeContext, input: PineconeEndpointInputs[K]) => {
		const response = await makePineconeRequest<PineconeEndpointOutputs[K]>(
			config.path(input),
			ctx.key,
			{
				method: config.method,
				surface: config.surface,
				body: config.body?.(input),
				query: config.query?.(input),
				schema: PineconeEndpointOutputSchemas[key] as unknown as ZodType<
					PineconeEndpointOutputs[K]
				>,
			},
		);

		await logEventFromContext(ctx, `pinecone.${key}`, input, 'completed');
		return response;
	}) as PineconeEndpoints[K];
}
