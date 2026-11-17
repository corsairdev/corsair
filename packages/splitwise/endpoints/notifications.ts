import type { SplitwiseEndpoints } from '..';
import { call } from './call';
import {
	SplitwiseEndpointInputSchemas,
	SplitwiseEndpointOutputSchemas,
} from './types';

export const list: SplitwiseEndpoints['notificationsList'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'notifications.list',
			input: SplitwiseEndpointInputSchemas.listNotifications,
			output: SplitwiseEndpointOutputSchemas.listNotifications,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'get_notifications',
			query: { updated_after: parsed.updated_after, limit: parsed.limit },
		}),
		{
			log: (parsed, result) => ({
				updated_after: parsed.updated_after,
				notifications: result.notifications.length,
			}),
		},
	);
