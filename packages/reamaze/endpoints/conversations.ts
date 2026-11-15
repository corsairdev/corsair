import type { ReamazeEndpoints } from '..';
import { pathSegment } from '../client';
import { call, dataParams, queryOf, unwrapList, unwrapObject } from './call';
import {
	ReamazeEndpointInputSchemas as Inputs,
	ReamazeEndpointOutputSchemas as Outputs,
} from './types';

export const list: ReamazeEndpoints['conversationsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'conversations.list',
			input: Inputs.conversationsList,
			output: Outputs.conversationsList,
		},
		input,
		({
			filter,
			for: forUser,
			for_id,
			sort,
			tag,
			category,
			page,
			start_date,
			end_date,
			origin,
			data,
		}) => ({
			method: 'GET',
			path: '/conversations',
			query: {
				...queryOf({
					filter,
					for: forUser,
					for_id,
					sort,
					tag,
					category,
					page,
					start_date,
					end_date,
					origin,
				}),
				...dataParams(data),
			},
		}),
		{
			shape: (raw) => ({
				...unwrapObject(raw, 'conversation list'),
				conversations: unwrapList(raw, 'conversations', 'conversation list'),
			}),
			log: (_, result) => ({ count: result.conversations.length }),
		},
	);

export const get: ReamazeEndpoints['conversationsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'conversations.get',
			input: Inputs.conversationsGet,
			output: Outputs.conversationsGet,
		},
		input,
		({ slug, id_type, category, channel }) => ({
			method: 'GET',
			path: `/conversations/${pathSegment(slug)}`,
			query: queryOf({ id_type, category, channel }),
		}),
		{
			shape: (raw) => unwrapObject(raw, 'conversation'),
			log: (parsed) => ({ slug: parsed.slug }),
		},
	);

export const create: ReamazeEndpoints['conversationsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'conversations.create',
			input: Inputs.conversationsCreate,
			output: Outputs.conversationsCreate,
		},
		input,
		({
			subject,
			category,
			tag_list,
			status,
			hold_until,
			data,
			assignee,
			message,
			user,
		}) => ({
			method: 'POST',
			path: '/conversations',
			body: {
				conversation: {
					subject,
					category,
					tag_list,
					status,
					hold_until,
					data,
					assignee,
					message,
					user,
				},
			},
		}),
		{
			shape: (raw) => unwrapObject(raw, 'created conversation'),
			log: (parsed, result) => ({
				slug: typeof result.slug === 'string' ? result.slug : undefined,
				category: parsed.category,
			}),
		},
	);

export const update: ReamazeEndpoints['conversationsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'conversations.update',
			input: Inputs.conversationsUpdate,
			output: Outputs.conversationsUpdate,
		},
		input,
		({
			slug,
			assignee,
			tag_list,
			status,
			hold_until,
			data,
			category,
			brand,
		}) => ({
			method: 'PUT',
			path: `/conversations/${pathSegment(slug)}`,
			body: {
				conversation: {
					assignee,
					tag_list,
					status,
					hold_until,
					data,
					category,
					brand,
				},
			},
		}),
		{
			shape: (raw) => unwrapObject(raw, 'updated conversation'),
			log: (parsed) => ({ slug: parsed.slug }),
		},
	);
