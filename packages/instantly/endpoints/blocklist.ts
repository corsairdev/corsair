import type { InstantlyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';

export const list: InstantlyEndpoints['blocklistList'] = (ctx, input) =>
	call(
		ctx,
		'blocklistList',
		'blocklist.list',
		input,
		(query) => ({ method: 'GET', path: '/block-lists-entries', query }),
		{ log: (_, result) => ({ count: result.items.length }) },
	);

export const add: InstantlyEndpoints['blocklistAdd'] = (ctx, input) =>
	call(
		ctx,
		'blocklistAdd',
		'blocklist.add',
		input,
		({ bl_value }) => ({
			method: 'POST',
			path: '/block-lists-entries',
			body: { bl_value },
		}),
		{ log: (_, entry) => ({ entryId: entry.id, isDomain: entry.is_domain }) },
	);

export const remove: InstantlyEndpoints['blocklistRemove'] = (ctx, input) =>
	call(
		ctx,
		'blocklistRemove',
		'blocklist.remove',
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/block-lists-entries/${segment(id)}`,
		}),
		{ log: ({ id }) => ({ entryId: id }) },
	);
