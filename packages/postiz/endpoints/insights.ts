import type { PostizEndpoints } from '..';
import { segment } from '../client';
import { asList, call } from './call';
import {
	PostizEndpointInputSchemas as Inputs,
	PostizEndpointOutputSchemas as Outputs,
} from './types';

export const list: PostizEndpoints['mediaList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'media.list',
			input: Inputs.mediaList,
			output: Outputs.mediaList,
		},
		input,
		({ page }) => ({ method: 'GET', path: '/media', query: { page } }),
		{
			// The route answers a bare array of files, not an envelope.
			shape: asList('media'),
			log: (_, result) => ({ count: result.media.length }),
		},
	);

export const notifications: PostizEndpoints['notificationsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'notifications.list',
			input: Inputs.notificationsList,
			output: Outputs.notificationsList,
		},
		input,
		({ page }) => ({
			method: 'GET',
			path: '/notifications',
			query: { page },
		}),
		{
			shape: asList('notifications'),
			log: (_, result) => ({ count: result.notifications.length }),
		},
	);

export const analytics: PostizEndpoints['analyticsPlatform'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'analytics.platform',
			input: Inputs.analyticsPlatform,
			output: Outputs.analyticsPlatform,
		},
		input,
		({ integration, date }) => ({
			method: 'GET',
			path: `/analytics/${segment(integration)}`,
			query: { date },
		}),
		{
			shape: asList('analytics'),
			log: (_, result) => ({ rows: result.analytics.length }),
		},
	);
