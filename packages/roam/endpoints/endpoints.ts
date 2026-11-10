import { asRecord } from 'corsair/core';
import type { RoamEndpoints } from '..';
import { call, queryOf } from './call';
import { envelopeShape, listShape } from './shape';
import {
	RoamEndpointInputSchemas as Inputs,
	RoamEndpointOutputSchemas as Outputs,
} from './types';

/** `expand` is a comma-separated list on the wire, not a repeated parameter. */
function expandOf(expand: string[] | undefined) {
	return expand?.join(',');
}

export const tokenInfo: RoamEndpoints['tokenInfo'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'token.info',
			input: Inputs.tokenInfo,
			output: Outputs.tokenInfo,
		},
		input,
		() => ({ method: 'GET', path: '/token.info', replayable: true }),
		{
			shape: envelopeShape('token'),
			log: (_, result) => ({
				userId: result.token.user?.id ?? '',
				scopes: result.token.scopes?.length ?? 0,
			}),
		},
	);

export const userInfo: RoamEndpoints['userInfo'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'user.info',
			input: Inputs.userInfo,
			output: Outputs.userInfo,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/user.info',
			replayable: true,
			query: queryOf({
				id: parsed.user_id,
				email: parsed.email,
				expand: expandOf(parsed.expand),
			}),
		}),
		{
			shape: envelopeShape('user'),
			log: (_, result) => ({ userId: result.user.id ?? '' }),
		},
	);

export const userList: RoamEndpoints['userList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'user.list',
			input: Inputs.userList,
			output: Outputs.userList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/user.list',
			replayable: true,
			query: queryOf({
				// `ids` is a comma-separated list, not a repeated parameter.
				ids: parsed.ids?.join(','),
				q: parsed.q,
				limit: parsed.limit,
				cursor: parsed.cursor,
				expand: expandOf(parsed.expand),
			}),
		}),
		{
			shape: listShape('users'),
			log: (_, result) => ({
				count: result.users.length,
				hasMore: result.has_more,
			}),
		},
	);

export const chatList: RoamEndpoints['chatList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'chat.list',
			input: Inputs.chatList,
			output: Outputs.chatList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/chat.list',
			replayable: true,
			query: queryOf({
				limit: parsed.limit,
				cursor: parsed.cursor,
				expand: expandOf(parsed.expand),
			}),
		}),
		{
			shape: listShape('chats'),
			log: (_, result) => ({
				count: result.chats.length,
				hasMore: result.has_more,
			}),
		},
	);

export const chatHistory: RoamEndpoints['chatHistory'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'chat.history',
			input: Inputs.chatHistory,
			output: Outputs.chatHistory,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/chat.history',
			replayable: true,
			query: queryOf({
				chatId: parsed.chat_id,
				groupId: parsed.group_id,
				userIds: parsed.user_ids?.join(','),
				threadTimestamp: parsed.thread_timestamp,
				after: parsed.after,
				before: parsed.before,
				ascending: parsed.ascending,
				cursor: parsed.cursor,
				limit: parsed.limit,
				expand: expandOf(parsed.expand),
			}),
		}),
		{
			shape: listShape('messages'),
			log: (_, result) => ({
				count: result.messages.length,
				hasMore: result.has_more,
			}),
		},
	);

export const chatPost: RoamEndpoints['chatPost'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'chat.post',
			input: Inputs.chatPost,
			output: Outputs.chatPost,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/chat.post',
			replayable: false,
			body: {
				chatId: parsed.chat_id,
				groupId: parsed.group_id,
				userIds: parsed.user_ids,
				threadTimestamp: parsed.thread_timestamp,
				threadKey: parsed.thread_key,
				replyTimestamp: parsed.reply_timestamp,
				text: parsed.text,
				markdown: parsed.markdown,
				items: parsed.items,
				assetIds: parsed.asset_ids,
				blocks: parsed.blocks,
				color: parsed.color,
				poll: parsed.poll,
				sender: parsed.sender,
				sync: parsed.sync,
				sendAt: parsed.send_at,
			},
		}),
		{
			shape: envelopeShape('post'),
			// The text is the caller's own content, so only ids are logged.
			log: (_, result) => ({
				chatId: result.post.chatId ?? '',
				timestamp: result.post.timestamp ?? 0,
				scheduled:
					result.post.scheduledMessageId !== null &&
					result.post.scheduledMessageId !== undefined,
			}),
		},
	);

export const chatUpdate: RoamEndpoints['chatUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'chat.update',
			input: Inputs.chatUpdate,
			output: Outputs.chatUpdate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/chat.update',
			replayable: false,
			body: {
				chatId: parsed.chat_id,
				timestamp: parsed.timestamp,
				threadTimestamp: parsed.thread_timestamp,
				text: parsed.text,
				markdown: parsed.markdown,
				items: parsed.items,
				assetIds: parsed.asset_ids,
				blocks: parsed.blocks,
				color: parsed.color,
			},
		}),
		{
			shape: envelopeShape('update'),
			log: (parsed, result) => ({
				chatId: parsed.chat_id,
				timestamp: result.update.timestamp ?? parsed.timestamp,
			}),
		},
	);

export const reactionAdd: RoamEndpoints['reactionAdd'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'reaction.add',
			input: Inputs.reactionAdd,
			output: Outputs.reactionAdd,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/reaction.add',
			replayable: false,
			body: {
				chatId: parsed.chat_id,
				timestamp: parsed.timestamp,
				threadTimestamp: parsed.thread_timestamp,
				name: parsed.name,
			},
		}),
		{
			shape: envelopeShape('reaction'),
			log: (_, result) => ({
				chatId: result.reaction.chatId ?? '',
				name: result.reaction.name ?? '',
			}),
		},
	);

export const reactionList: RoamEndpoints['reactionList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'reaction.list',
			input: Inputs.reactionList,
			output: Outputs.reactionList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/reaction.list',
			replayable: true,
			query: queryOf({
				chatId: parsed.chat_id,
				timestamp: parsed.timestamp,
				threadTimestamp: parsed.thread_timestamp,
			}),
		}),
		{
			// This answer carries the reactions array and no paging block.
			shape: (raw) => {
				const record = asRecord(raw);
				return { reactions: record?.reactions };
			},
			log: (_, result) => ({ count: result.reactions.length }),
		},
	);

export const groupList: RoamEndpoints['groupList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'group.list',
			input: Inputs.groupList,
			output: Outputs.groupList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/group.list',
			replayable: true,
			query: queryOf({
				query: parsed.query,
				type: parsed.type,
				limit: parsed.limit,
				cursor: parsed.cursor,
			}),
		}),
		{
			shape: listShape('groups'),
			log: (_, result) => ({
				count: result.groups.length,
				hasMore: result.has_more,
			}),
		},
	);

export const meetingList: RoamEndpoints['meetingList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'meeting.list',
			input: Inputs.meetingList,
			output: Outputs.meetingList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/meeting.list',
			replayable: true,
			query: queryOf({
				before: parsed.before,
				after: parsed.after,
				limit: parsed.limit,
				cursor: parsed.cursor,
				expand: expandOf(parsed.expand),
			}),
		}),
		{
			shape: listShape('meetings'),
			log: (_, result) => ({
				count: result.meetings.length,
				hasMore: result.has_more,
			}),
		},
	);

export const meetingTranscript: RoamEndpoints['meetingTranscript'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'meeting.transcript',
			input: Inputs.meetingTranscript,
			output: Outputs.meetingTranscript,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/meeting.transcript',
			replayable: true,
			query: { id: parsed.meeting_id },
		}),
		{
			shape: envelopeShape('transcript'),
			// A transcript is meeting content, so only its shape is logged.
			log: (_, result) => ({
				meetingId: result.transcript.id ?? '',
				segments: result.transcript.segments?.length ?? 0,
			}),
		},
	);
