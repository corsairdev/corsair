import type { UserflowEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	UserflowEndpointInputSchemas as Inputs,
	UserflowEndpointOutputSchemas as Outputs,
} from './types';

export const get: UserflowEndpoints['contentGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'content.get',
			input: Inputs.contentGet,
			output: Outputs.contentGet,
		},
		input,
		({ id, expand }) => ({
			method: 'GET',
			path: `/content/${segment(id)}`,
			query: { expand },
		}),
		{
			log: (_, result) => ({
				id: result.id ?? undefined,
				type: result.type ?? undefined,
			}),
		},
	);

export const list: UserflowEndpoints['contentList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'content.list',
			input: Inputs.contentList,
			output: Outputs.contentList,
		},
		input,
		({ limit, starting_after, type, order_by }) => ({
			method: 'GET',
			path: '/content',
			query: { limit, starting_after, type, order_by },
		}),
		{
			log: (_, result) => ({
				count: result.data?.length ?? 0,
				hasMore: result.has_more ?? false,
			}),
		},
	);

/** A content version holds the actual steps: a flow's questions or a checklist's tasks. */
export const getVersion: UserflowEndpoints['contentVersionsGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'content.getVersion',
			input: Inputs.contentVersionsGet,
			output: Outputs.contentVersionsGet,
		},
		input,
		({ id, expand }) => ({
			method: 'GET',
			path: `/content_versions/${segment(id)}`,
			query: { expand },
		}),
		{
			log: (_, result) => ({
				id: result.id ?? undefined,
				number: result.number ?? undefined,
			}),
		},
	);

/**
 * Versions can only be listed for one content object at a time — Userflow
 * requires `content_id` and has no cross-content listing.
 */
export const listVersions: UserflowEndpoints['contentVersionsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'content.listVersions',
			input: Inputs.contentVersionsList,
			output: Outputs.contentVersionsList,
		},
		input,
		({ content_id, limit, starting_after, number, order_by }) => ({
			method: 'GET',
			path: '/content_versions',
			query: { content_id, limit, starting_after, number, order_by },
		}),
		{
			log: ({ content_id }, result) => ({
				content: content_id,
				count: result.data?.length ?? 0,
				hasMore: result.has_more ?? false,
			}),
		},
	);
