import { logEventFromContext } from 'corsair/core';
import type { ShipEngineEndpoints } from '..';
import type { ShipEngineEndpointOutputs } from './types';
import { makeShipEngineRequest } from '../client';

export const get: ShipEngineEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeShipEngineRequest<ShipEngineEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'shipengine.example.get', { ...input }, 'completed');
	return response;
};
