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
			query: {
				page_size: input.page_size,
				next_page_token: input.next_page_token,
				search_text: input.search_text,
				platform_os: input.platform_os,
				device_vendor: input.device_vendor,
				device_model: input.device_model,
				device_status: input.device_status,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'zoom.devices.list',
		{ ...input },
		'completed',
	);
	return result;
};
