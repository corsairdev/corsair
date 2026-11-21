import type { StormboardEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	StormboardEndpointInputSchemas as Inputs,
	StormboardEndpointOutputSchemas as Outputs,
} from './types';

export const create: StormboardEndpoints['chatCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'chat.create',
			input: Inputs.chatCreate,
			output: Outputs.chatCreate,
		},
		input,
		({ stormId, message }) => ({
			method: 'POST',
			path: `/chat/${segment(stormId)}`,
			body: { message },
		}),
	);

export const list: StormboardEndpoints['chatList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'chat.list',
			input: Inputs.chatList,
			output: Outputs.chatList,
		},
		input,
		({ stormId }) => ({
			method: 'GET',
			path: `/chat/${segment(stormId)}/list`,
		}),
		{
			log: (_, result) => ({ count: result.messages.length }),
		},
	);

export const listUnread: StormboardEndpoints['chatListUnread'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'chat.listUnread',
			input: Inputs.chatListUnread,
			output: Outputs.chatListUnread,
		},
		input,
		({ stormId }) => ({
			method: 'GET',
			path: `/chat/${segment(stormId)}/new`,
		}),
		{
			log: (_, result) => ({ count: result.messages.length }),
		},
	);

// Marking messages read mutates Stormboard state, so it is a write.
export const markAllRead: StormboardEndpoints['chatMarkAllRead'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'chat.markAllRead',
			input: Inputs.chatMarkAllRead,
			output: Outputs.chatMarkAllRead,
		},
		input,
		({ stormId }) => ({
			method: 'PUT',
			path: `/chat/${segment(stormId)}/allread`,
			body: {},
		}),
		{
			log: () => ({ markedRead: true }),
		},
	);
