import { logEventFromContext } from 'corsair/core';
import type { ZoomEndpoints } from '..';
import { makeZoomRequest } from '../client';
import type { ZoomEndpointOutputs } from './types';

export const list: ZoomEndpoints['devicesList'] = async (ctx, input) => {
	const result = await makeZoomRequest<ZoomEndpointOutputs['devicesList']>(
		'devices',
		ctx.key,
		{
			method: 'GET',
			query: input,
		},
	);

	if (result.devices && ctx.db.devices) {
		try {
			for (const device of result.devices) {
				if (device.id && typeof device.id === 'string') {
					await ctx.db.devices.upsertByEntityId(device.id, device);
				}
			}
		} catch (error) {
			console.warn('Failed to save devices to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'zoom.devices.list',
		{ ...input },
		'completed',
	);
	return result;
};
