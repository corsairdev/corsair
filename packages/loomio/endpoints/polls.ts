import type { LoomioEndpoints } from '..';
import { segment } from '../client';
import { call, unwrapResource, withPaging } from './call';
import {
	LoomioEndpointInputSchemas as Inputs,
	LoomioEndpointOutputSchemas as Outputs,
} from './types';

export const list: LoomioEndpoints['pollsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'polls.list',
			input: Inputs.pollsList,
			output: Outputs.pollsList,
		},
		input,
		({ group_id, status, limit, offset }) => ({
			method: 'GET',
			path: '/polls',
			query: { group_id, status, limit, offset },
		}),
		{
			shape: (raw, parsed) => withPaging(raw, 'polls', parsed.offset ?? 0),
			log: (_, result) => ({ count: result.polls.length }),
		},
	);

export const get: LoomioEndpoints['pollsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'polls.get',
			input: Inputs.pollsGet,
			output: Outputs.pollsGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/polls/${segment(id)}`,
			resourceScoped: true,
		}),
		{
			shape: (raw) => unwrapResource(raw, 'polls', 'poll'),
			log: (_, result) => ({ pollId: result.poll.id }),
		},
	);

export const create: LoomioEndpoints['pollsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'polls.create',
			input: Inputs.pollsCreate,
			output: Outputs.pollsCreate,
		},
		input,
		({
			group_id,
			discussion_id,
			title,
			poll_type,
			options,
			poll_options_attributes,
			closing_at,
			specified_voters_only,
			hide_results,
			anonymous,
			shuffle_options,
			stance_reason_required,
			reason_prompt,
			notify_on_closing_soon,
			recipient_audience,
			recipient_user_ids,
			recipient_emails,
			recipient_message,
			notify_recipients,
		}) => ({
			method: 'POST',
			path: '/polls',
			body: {
				group_id,
				discussion_id,
				title,
				poll_type,
				options,
				poll_options_attributes,
				// An explicit null keeps the poll a draft, which Loomio documents.
				closing_at,
				specified_voters_only,
				hide_results,
				anonymous,
				shuffle_options,
				stance_reason_required,
				reason_prompt,
				notify_on_closing_soon,
				recipient_audience,
				recipient_user_ids,
				recipient_emails,
				recipient_message,
				notify_recipients,
			},
		}),
		{
			shape: (raw) => unwrapResource(raw, 'polls', 'poll'),
			log: (_, result) => ({
				pollId: result.poll.id,
				pollType: result.poll.poll_type ?? undefined,
			}),
		},
	);
