import type { WacheteEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	WacheteEndpointInputSchemas as Inputs,
	WacheteEndpointOutputSchemas as Outputs,
} from './types';

/** Notifications are what a monitor triggered, newest first. */
export const list: WacheteEndpoints['notificationsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'notifications.list',
			input: Inputs.notificationsList,
			output: Outputs.notificationsList,
		},
		input,
		({ taskId, from, to, count, continuationToken, html }) => ({
			method: 'GET',
			path: '/thirdparty/v1/notification/list',
			query: { taskId, from, to, count, continuationToken, html },
		}),
		{
			log: (_, result) => ({
				count: result.data?.length ?? 0,
				hasMore: result.continuationToken != null,
			}),
		},
	);

/**
 * One notification as the HTML that was sent — the rendered alert, not a
 * structured value. It is the only route that returns HTML rather than JSON.
 */
export const get: WacheteEndpoints['notificationsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'notifications.get',
			input: Inputs.notificationsGet,
			output: Outputs.notificationsGet,
		},
		input,
		({ alertId }) => ({
			method: 'GET',
			path: `/thirdparty/v1/notification/${segment(alertId)}`,
		}),
		{
			log: (_, result) => ({
				name: result.name ?? undefined,
				// Whether an HTML body came back, never its content, which is the
				// watched page's text.
				html: (result.html ?? '').length,
			}),
		},
	);
