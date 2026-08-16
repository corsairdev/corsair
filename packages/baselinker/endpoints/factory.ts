import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeBaseLinkerRequest } from '../client';
import type { BaseLinkerContext } from '../index';
import { auditPayload } from './logging';
import type { BaseLinkerMethod } from './operations';
import { evictOperationResult, mirrorOperationResult } from './persist';
import type {
	BaseLinkerEndpointInputs,
	BaseLinkerEndpointOutputs,
} from './types';

export function createBaseLinkerEndpoint<K extends BaseLinkerMethod>(
	method: K,
): CorsairEndpoint<
	BaseLinkerContext,
	BaseLinkerEndpointInputs[K],
	BaseLinkerEndpointOutputs[K]
> {
	return async (ctx, input) => {
		const parameters = (input ?? {}) as Record<string, unknown>;
		const response = await makeBaseLinkerRequest<BaseLinkerEndpointOutputs[K]>(
			method,
			ctx.key,
			parameters,
		);
		const responseRecord = response as Record<string, unknown>;
		await mirrorOperationResult(ctx.db, method, responseRecord);
		await evictOperationResult(ctx.db, method, parameters);
		await logEventFromContext(
			ctx,
			`baselinker.${method}`,
			auditPayload(parameters),
			'completed',
		);
		return response;
	};
}
