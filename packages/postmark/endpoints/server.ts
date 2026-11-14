import type { PostmarkEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	PostmarkEndpointInputSchemas as Inputs,
	PostmarkEndpointOutputSchemas as Outputs,
} from './types';

export const get: PostmarkEndpoints['serverGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'server.get',
			input: Inputs.serverGet,
			output: Outputs.serverGet,
		},
		input,
		() => ({ method: 'GET', path: '/server' }),
		{ log: (_, result) => ({ serverId: result.ID ?? undefined }) },
	);

export const update: PostmarkEndpoints['serverUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'server.update',
			input: Inputs.serverUpdate,
			output: Outputs.serverUpdate,
		},
		input,
		(body) => ({ method: 'PUT', path: '/server', body }),
		{ log: (_, result) => ({ serverId: result.ID ?? undefined }) },
	);

export const streams: PostmarkEndpoints['streamsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'streams.list',
			input: Inputs.streamsList,
			output: Outputs.streamsList,
		},
		input,
		({ MessageStreamType, IncludeArchivedStreams }) => ({
			method: 'GET',
			path: '/message-streams',
			query: { MessageStreamType, IncludeArchivedStreams },
		}),
		{ log: (_, result) => ({ count: result.MessageStreams.length }) },
	);

export const stream: PostmarkEndpoints['streamsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'streams.get',
			input: Inputs.streamsGet,
			output: Outputs.streamsGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/message-streams/${segment(id)}`,
		}),
		{ log: ({ id }) => ({ streamId: id }) },
	);

export const archiveStream: PostmarkEndpoints['streamsArchive'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'streams.archive',
			input: Inputs.streamsArchive,
			output: Outputs.streamsArchive,
		},
		input,
		({ id }) => ({
			method: 'POST',
			path: `/message-streams/${segment(id)}/archive`,
		}),
		{ log: ({ id }) => ({ streamId: id }) },
	);
