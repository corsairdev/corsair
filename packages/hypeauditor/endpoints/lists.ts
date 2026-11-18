import type { HypeAuditorEndpoints } from '..';
import { call } from './call';
import {
	HypeAuditorEndpointInputSchemas as Inputs,
	HypeAuditorEndpointOutputSchemas as Outputs,
} from './types';

/** All lists in the account. The default "Recent searches" list is `id: 0`. */
export const list: HypeAuditorEndpoints['listsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.list',
			input: Inputs['lists.list'],
			output: Outputs['lists.list'],
		},
		input,
		() => ({ action: 'auditor.lists' }),
		{ log: (_, result) => ({ count: result.result.length }) },
	);

export const items: HypeAuditorEndpoints['listsItems'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.items',
			input: Inputs['lists.items'],
			output: Outputs['lists.items'],
		},
		input,
		({ id, limit, offset }) => ({
			action: 'auditor.list',
			query: { id, limit, offset },
		}),
	);

/**
 * Adding a report to a list changes saved state on the account, so it is a
 * write even though it is a GET: repeating it leaves the report in the list
 * either way, which is why it is safe to replay.
 */
export const add: HypeAuditorEndpoints['listsAdd'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.add',
			input: Inputs['lists.add'],
			output: Outputs['lists.add'],
		},
		input,
		({ list_id, channel_id, type }) => ({
			action: 'auditor.addToList',
			query: { list_id, channel_id, type },
		}),
		{ log: ({ list_id, type }) => ({ list_id, type }) },
	);

/**
 * Removing a report from a list changes saved state too. A second removal finds
 * nothing to remove, so the answer is not the same, which makes it not
 * replayable.
 */
export const remove: HypeAuditorEndpoints['listsRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.remove',
			input: Inputs['lists.remove'],
			output: Outputs['lists.remove'],
		},
		input,
		({ report_id, list_id }) => ({
			action: 'auditor.removeFromList',
			query: { report_id, list_id },
			replayable: false,
		}),
		{ log: ({ list_id }) => ({ list_id }) },
	);
