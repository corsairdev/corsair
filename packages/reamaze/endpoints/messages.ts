import type { ReamazeEndpoints } from '..';
import { pathSegment } from '../client';
import { call, queryOf, unwrapList, unwrapObject } from './call';
import {
	ReamazeEndpointInputSchemas as Inputs,
	ReamazeEndpointOutputSchemas as Outputs,
} from './types';

export const list: ReamazeEndpoints['messagesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.list',
			input: Inputs.messagesList,
			output: Outputs.messagesList,
		},
		input,
		({
			filter,
			tag,
			origin,
			page,
			sent_by,
			category,
			start_date,
			end_date,
			include,
		}) => ({
			method: 'GET',
			path: '/messages',
			query: queryOf({
				filter,
				tag,
				origin,
				page,
				sent_by,
				category,
				start_date,
				end_date,
				include,
			}),
		}),
		{
			shape: (raw) => ({
				...unwrapObject(raw, 'message list'),
				messages: unwrapList(raw, 'messages', 'message list'),
			}),
			log: (_, result) => ({ count: result.messages.length }),
		},
	);

export const create: ReamazeEndpoints['messagesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.create',
			input: Inputs.messagesCreate,
			output: Outputs.messagesCreate,
		},
		input,
		({
			slug,
			body,
			visibility,
			user,
			origin_id,
			suppress_notifications,
			suppress_autoresolve,
			suppress_surveys,
			attachment,
			attachments,
			recipients,
		}) => ({
			// The message is created under its conversation, so the slug is a path
			// segment and never part of the body.
			method: 'POST',
			path: `/conversations/${pathSegment(slug)}/messages`,
			body: {
				message: {
					body,
					visibility,
					user,
					origin_id,
					suppress_notifications,
					suppress_autoresolve,
					suppress_surveys,
					attachment,
					attachments,
					recipients,
				},
			},
		}),
		{
			shape: (raw) => unwrapObject(raw, 'created message'),
			log: (parsed, result) => ({
				slug: parsed.slug,
				visibility: parsed.visibility,
				conversation:
					typeof result.conversation?.slug === 'string'
						? result.conversation.slug
						: undefined,
			}),
		},
	);
