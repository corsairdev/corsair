import type { SuperchatEndpoints } from '..';
import { segment } from '../client';
import { call } from './shared';
import {
	SuperchatEndpointInputSchemas as Inputs,
	SuperchatEndpointOutputSchemas as Outputs,
} from './types';

/** A channel is what messages are sent from, so its id is the `from` id. */
export const list: SuperchatEndpoints['channelsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'channels.list',
			input: Inputs.channelsList,
			output: Outputs.channelsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/channels', query }),
		{ log: (_, result) => ({ count: result.results.length }) },
	);

export const get: SuperchatEndpoints['channelsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'channels.get',
			input: Inputs.channelsGet,
			output: Outputs.channelsGet,
		},
		input,
		({ channelId }) => ({
			method: 'GET',
			path: `/channels/${segment(channelId)}`,
		}),
		{ log: ({ channelId }) => ({ channelId }) },
	);
