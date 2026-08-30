import { logEventFromContext } from 'corsair/core';
import type { ZodType } from 'zod';
import type { PineconeContext, PineconeEndpoints } from '..';
import type { PineconeSurface } from '../client';
import { makePineconeRequest } from '../client';
import type {
	PineconeEndpointInputs,
	PineconeEndpointOutputs,
	PineconeEndpointParsedInputs,
} from './types';
import {
	PineconeEndpointInputSchemas,
	PineconeEndpointOutputSchemas,
} from './types';

type OperationKey = keyof PineconeEndpointInputs &
	keyof PineconeEndpointOutputs;

type OperationConfig<K extends OperationKey> = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: (input: PineconeEndpointParsedInputs[K]) => string;
	surface?: PineconeSurface;
	host?: (input: PineconeEndpointParsedInputs[K]) => string;
	body?: (input: PineconeEndpointParsedInputs[K]) => unknown;
	mediaType?: string;
	query?: (
		input: PineconeEndpointParsedInputs[K],
	) => Record<
		string,
		string | number | boolean | readonly string[] | undefined
	>;
};

/** Builds an endpoint that validates input, performs the request, and logs completion. */
export function definePineconeEndpoint<K extends OperationKey>(
	key: K,
	config: OperationConfig<K>,
): PineconeEndpoints[K] {
	return (async (ctx: PineconeContext, input: PineconeEndpointInputs[K]) => {
		const parsedInput = PineconeEndpointInputSchemas[key].parse(
			input,
		) as PineconeEndpointParsedInputs[K];
		const response = await makePineconeRequest<PineconeEndpointOutputs[K]>(
			config.path(parsedInput),
			ctx.key,
			{
				method: config.method,
				surface: config.surface,
				host: config.host?.(parsedInput),
				body: config.body?.(parsedInput),
				mediaType: config.mediaType,
				query: config.query?.(parsedInput),
				schema: PineconeEndpointOutputSchemas[key] as unknown as ZodType<
					PineconeEndpointOutputs[K]
				>,
			},
		);

		// Endpoint inputs can contain messages, files, vectors, and metadata.
		// Record only the operation type; never persist caller payloads here.
		await logEventFromContext(ctx, `pinecone.${key}`, {}, 'completed');
		return response;
	}) as PineconeEndpoints[K];
}
