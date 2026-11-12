import { asRecord } from 'corsair/core';
import type { RevoltEndpoints } from '..';
import { segment } from '../client';
import { call, queryOf } from './call';
import { emptyShape, messagesShape, singleShape } from './shape';
import {
	RevoltEndpointInputSchemas as Inputs,
	RevoltEndpointOutputSchemas as Outputs,
} from './types';

export const userMe: RevoltEndpoints['userMe'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'user.me',
			input: Inputs.userMe,
			output: Outputs.userMe,
		},
		input,
		() => ({ method: 'GET', path: '/users/@me', replayable: true }),
		{
			shape: singleShape('user'),
			log: (_, result) => ({ userId: result.user._id ?? '' }),
		},
	);

export const userGet: RevoltEndpoints['userGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'user.get',
			input: Inputs.userGet,
			output: Outputs.userGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/users/${segment(parsed.user_id)}`,
			replayable: true,
		}),
		{
			shape: singleShape('user'),
			log: (_, result) => ({ userId: result.user._id ?? '' }),
		},
	);

export const userDms: RevoltEndpoints['userDms'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'user.dms',
			input: Inputs.userDms,
			output: Outputs.userDms,
		},
		input,
		() => ({ method: 'GET', path: '/users/dms', replayable: true }),
		{
			// The route answers the DM channels beside the users they belong to.
			shape: (raw) => {
				const record = asRecord(raw);
				return { users: record?.users, channels: record?.channels };
			},
			log: (_, result) => ({ count: result.channels.length }),
		},
	);

export const channelGet: RevoltEndpoints['channelGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'channel.get',
			input: Inputs.channelGet,
			output: Outputs.channelGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/channels/${segment(parsed.channel_id)}`,
			replayable: true,
		}),
		{
			shape: singleShape('channel'),
			log: (_, result) => ({ channelId: result.channel._id ?? '' }),
		},
	);

export const channelEdit: RevoltEndpoints['channelEdit'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'channel.edit',
			input: Inputs.channelEdit,
			output: Outputs.channelEdit,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `/channels/${segment(parsed.channel_id)}`,
			replayable: false,
			body: queryOf({
				name: parsed.name,
				description: parsed.description,
				icon: parsed.icon,
			}),
		}),
		{
			shape: singleShape('channel'),
			log: (parsed) => ({ channelId: parsed.channel_id }),
		},
	);

export const channelDelete: RevoltEndpoints['channelDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'channel.delete',
			input: Inputs.channelDelete,
			output: Outputs.channelDelete,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/channels/${segment(parsed.channel_id)}`,
			replayable: false,
		}),
		{
			shape: emptyShape(),
			log: (parsed) => ({ channelId: parsed.channel_id }),
		},
	);

export const messagesList: RevoltEndpoints['messagesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.list',
			input: Inputs.messagesList,
			output: Outputs.messagesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/channels/${segment(parsed.channel_id)}/messages`,
			replayable: true,
			query: queryOf({
				limit: parsed.limit,
				before: parsed.before,
				after: parsed.after,
				nearby: parsed.nearby,
				sort: parsed.sort,
				include_users: parsed.include_users,
			}),
		}),
		{
			shape: messagesShape(),
			log: (_, result) => ({ count: result.messages.length }),
		},
	);

export const messagesGet: RevoltEndpoints['messagesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.get',
			input: Inputs.messagesGet,
			output: Outputs.messagesGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/channels/${segment(parsed.channel_id)}/messages/${segment(
				parsed.message_id,
			)}`,
			replayable: true,
		}),
		{
			shape: singleShape('message'),
			log: (_, result) => ({ messageId: result.message._id ?? '' }),
		},
	);

export const messagesSend: RevoltEndpoints['messagesSend'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.send',
			input: Inputs.messagesSend,
			output: Outputs.messagesSend,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `/channels/${segment(parsed.channel_id)}/messages`,
			replayable: false,
			body: queryOf({
				content: parsed.content,
				nonce: parsed.nonce,
				replies: parsed.replies,
				attachments: parsed.attachments,
			}),
		}),
		{
			shape: singleShape('message'),
			// The content is the caller's own text, so only the id is logged.
			log: (_, result) => ({ messageId: result.message._id ?? '' }),
		},
	);

export const messagesEdit: RevoltEndpoints['messagesEdit'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.edit',
			input: Inputs.messagesEdit,
			output: Outputs.messagesEdit,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `/channels/${segment(parsed.channel_id)}/messages/${segment(
				parsed.message_id,
			)}`,
			replayable: false,
			body: { content: parsed.content },
		}),
		{
			shape: singleShape('message'),
			log: (parsed) => ({ messageId: parsed.message_id }),
		},
	);

export const messagesDelete: RevoltEndpoints['messagesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.delete',
			input: Inputs.messagesDelete,
			output: Outputs.messagesDelete,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/channels/${segment(parsed.channel_id)}/messages/${segment(
				parsed.message_id,
			)}`,
			replayable: false,
		}),
		{
			shape: emptyShape(),
			log: (parsed) => ({ messageId: parsed.message_id }),
		},
	);

export const reactionsAdd: RevoltEndpoints['reactionsAdd'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'reactions.add',
			input: Inputs.reactionsAdd,
			output: Outputs.reactionsAdd,
		},
		input,
		(parsed) => ({
			method: 'PUT',
			path: `/channels/${segment(parsed.channel_id)}/messages/${segment(
				parsed.message_id,
			)}/reactions/${segment(parsed.emoji)}`,
			replayable: false,
		}),
		{
			shape: emptyShape(),
			log: (parsed) => ({ messageId: parsed.message_id }),
		},
	);

export const serverGet: RevoltEndpoints['serverGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'server.get',
			input: Inputs.serverGet,
			output: Outputs.serverGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/servers/${segment(parsed.server_id)}`,
			replayable: true,
			query: queryOf({ include_channels: parsed.include_channels }),
		}),
		{
			shape: singleShape('server'),
			log: (_, result) => ({ serverId: result.server._id ?? '' }),
		},
	);

export const serverMembers: RevoltEndpoints['serverMembers'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'server.members',
			input: Inputs.serverMembers,
			output: Outputs.serverMembers,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/servers/${segment(parsed.server_id)}/members`,
			replayable: true,
			query: queryOf({ exclude_offline: parsed.exclude_offline }),
		}),
		{
			shape: (raw) => {
				const record = asRecord(raw);
				return { members: record?.members, users: record?.users };
			},
			log: (_, result) => ({ count: result.members.length }),
		},
	);
