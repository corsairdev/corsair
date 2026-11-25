import type { LoomioEndpoints } from '..';
import { segment } from '../client';
import { call, unwrapResource, withPaging } from './call';
import {
	LoomioEndpointInputSchemas as Inputs,
	LoomioEndpointOutputSchemas as Outputs,
} from './types';

export const list: LoomioEndpoints['discussionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'discussions.list',
			input: Inputs.discussionsList,
			output: Outputs.discussionsList,
		},
		input,
		({ group_id, status, limit, offset }) => ({
			method: 'GET',
			path: '/discussions',
			query: { group_id, status, limit, offset },
		}),
		{
			shape: (raw, parsed) =>
				withPaging(raw, 'discussions', parsed.offset ?? 0),
			log: (_, result) => ({ count: result.discussions.length }),
		},
	);

export const get: LoomioEndpoints['discussionsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'discussions.get',
			input: Inputs.discussionsGet,
			output: Outputs.discussionsGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/discussions/${segment(id)}`,
			resourceScoped: true,
		}),
		{
			shape: (raw) => unwrapResource(raw, 'discussions', 'discussion'),
			log: (_, result) => ({ discussionId: result.discussion.id }),
		},
	);

export const create: LoomioEndpoints['discussionsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'discussions.create',
			input: Inputs.discussionsCreate,
			output: Outputs.discussionsCreate,
		},
		input,
		({
			group_id,
			title,
			description,
			description_format,
			recipient_audience,
			recipient_user_ids,
			recipient_emails,
			recipient_message,
		}) => ({
			method: 'POST',
			path: '/discussions',
			body: {
				group_id,
				title,
				description,
				description_format,
				recipient_audience,
				recipient_user_ids,
				recipient_emails,
				recipient_message,
			},
		}),
		{
			shape: (raw) => unwrapResource(raw, 'discussions', 'discussion'),
			log: (_, result) => ({
				discussionId: result.discussion.id,
				groupId: result.discussion.group_id ?? undefined,
			}),
		},
	);
