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
		({ page, search }) => ({
			method: 'GET',
			path: '/media',
			query: { page, search },
		}),
		{ log: (_, result) => ({ count: result.results.length }) },
	);

export const uploadFromUrl: PostizEndpoints['mediaUploadFromUrl'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'media.uploadFromUrl',
			input: Inputs.mediaUploadFromUrl,
			output: Outputs.mediaUploadFromUrl,
		},
		input,
		({ url, adjust }) => ({
			method: 'POST',
			path: '/upload-from-url',
			body: { url, adjust },
		}),
		{ log: (_, result) => ({ mediaId: result.id }) },
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
		{ log: (_, result) => ({ count: result.notifications.length }) },
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
