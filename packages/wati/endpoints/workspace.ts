import type { WatiEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	WatiEndpointInputSchemas as Inputs,
	WatiEndpointOutputSchemas as Outputs,
} from './types';

/** The channels connected to the workspace, with their types and numbers. */
export const channels: WatiEndpoints['channelsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'channels.list',
			input: Inputs.channelsList,
			output: Outputs.channelsList,
		},
		input,
		() => ({ method: 'GET', path: '/channels' }),
		{ log: (_, result) => ({ count: result.channels?.length ?? 0 }) },
	);

/** The workspace's messaging credit balance. */
export const credits: WatiEndpoints['accountCredits'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.credits',
			input: Inputs.accountCredits,
			output: Outputs.accountCredits,
		},
		input,
		() => ({ method: 'GET', path: '/account/credits' }),
		{
			log: (_, result) => ({
				credits: result.credits ?? result.balance ?? undefined,
			}),
		},
	);

export const broadcasts: WatiEndpoints['broadcastsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'broadcasts.list',
			input: Inputs.broadcastsList,
			output: Outputs.broadcastsList,
		},
		input,
		({ page_number, page_size }) => ({
			method: 'GET',
			path: '/broadcasts',
			query: { page_number, page_size },
		}),
		{
			log: (_, result) => ({
				count: (result.broadcasts ?? result.broadcast_list)?.length ?? 0,
				total: result.total ?? undefined,
			}),
		},
	);

export const broadcast: WatiEndpoints['broadcastsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'broadcasts.get',
			input: Inputs.broadcastsGet,
			output: Outputs.broadcastsGet,
		},
		input,
		({ broadcast_id }) => ({
			method: 'GET',
			path: `/broadcasts/${segment(broadcast_id)}`,
		}),
		{
			log: (_, result) => ({
				id: result.broadcast_id ?? result.id ?? undefined,
				status: result.status ?? undefined,
			}),
		},
	);

/** Per-recipient delivery outcomes for a broadcast. */
export const recipients: WatiEndpoints['broadcastsRecipients'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'broadcasts.recipients',
			input: Inputs.broadcastsRecipients,
			output: Outputs.broadcastsRecipients,
		},
		input,
		({ broadcast_id, page_number, page_size }) => ({
			method: 'GET',
			path: `/broadcasts/${segment(broadcast_id)}/recipients`,
			query: { page_number, page_size },
		}),
		{
			log: (_, result) => ({
				count: (result.recipients ?? result.recipient_list)?.length ?? 0,
				total: result.total ?? undefined,
			}),
		},
	);

export const segments: WatiEndpoints['segmentsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'segments.list',
			input: Inputs.segmentsList,
			output: Outputs.segmentsList,
		},
		input,
		({ page_number, page_size }) => ({
			method: 'GET',
			path: '/segments',
			query: { page_number, page_size },
		}),
		{
			log: (_, result) => ({
				count: result.segments?.length ?? 0,
				total: result.total ?? undefined,
			}),
		},
	);

export const segmentGet: WatiEndpoints['segmentsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'segments.get',
			input: Inputs.segmentsGet,
			output: Outputs.segmentsGet,
		},
		input,
		({ segmentId }) => ({
			method: 'GET',
			path: `/segments/${segment(segmentId)}`,
		}),
		{
			log: (_, result) => ({
				id: result.segmentId ?? result.id ?? undefined,
				name: result.name ?? undefined,
			}),
		},
	);

/**
 * Evaluates a set of contact filters and returns who matches, without saving
 * anything. This is a POST with the filters in the body: the v3 route evaluates
 * supplied `groups`, and `/segments/{id}/evaluate` does not exist.
 */
export const evaluate: WatiEndpoints['segmentsEvaluate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'segments.evaluate',
			input: Inputs.segmentsEvaluate,
			output: Outputs.segmentsEvaluate,
		},
		input,
		({ groups, page_number, page_size }) => ({
			method: 'POST',
			path: '/segments/evaluate',
			body: { groups },
			query: { page_number, page_size },
		}),
		{
			log: (parsed, result) => ({
				groups: parsed.groups.length,
				count: result.count ?? result.contacts?.length ?? 0,
			}),
		},
	);
