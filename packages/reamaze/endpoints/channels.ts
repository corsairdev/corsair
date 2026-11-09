import type { ReamazeEndpoints } from '..';
import { pathSegment } from '../client';
import { call, queryOf, unwrapList, unwrapObject } from './call';
import {
	ReamazeEndpointInputSchemas as Inputs,
	ReamazeEndpointOutputSchemas as Outputs,
} from './types';

export const list: ReamazeEndpoints['channelsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'channels.list',
			input: Inputs.channelsList,
			output: Outputs.channelsList,
		},
		input,
		({ channel }) => ({
			method: 'GET',
			path: '/channels',
			query: queryOf({ channel }),
		}),
		{
			shape: (raw) => ({
				...unwrapObject(raw, 'channel list'),
				channels: unwrapList(raw, 'channels', 'channel list'),
			}),
			log: (_, result) => ({ count: result.channels.length }),
		},
	);

export const get: ReamazeEndpoints['channelsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'channels.get',
			input: Inputs.channelsGet,
			output: Outputs.channelsGet,
		},
		input,
		({ slug }) => ({
			method: 'GET',
			path: `/channels/${pathSegment(slug)}`,
		}),
		{
			shape: (raw) => unwrapObject(raw, 'channel'),
			log: (_, result) => ({
				slug: typeof result.slug === 'string' ? result.slug : undefined,
			}),
		},
	);
