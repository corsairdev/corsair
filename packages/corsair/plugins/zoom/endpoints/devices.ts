import { logEventFromContext } from '../../utils/events';
import type { ZoomEndpoints } from '..';
import { makeZoomRequest } from '../client';
import type { ZoomEndpointOutputs } from './types';

export const list: ZoomEndpoints['devicesList'] = async (ctx, input) => {
	const result = await makeZoomRequest<ZoomEndpointOutputs['devicesList']>(
		'devices',
		ctx.key,
		{
			method: 'GET',
			query: input
		},
	);

	if (result.devices && ctx.db.devices) {
		try {
			for (const device of result.devices) {
				const d = device
				const deviceId = d.id
				if (deviceId && typeof deviceId === 'string') {
					await ctx.db.devices.upsertByEntityId(deviceId, d);
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
