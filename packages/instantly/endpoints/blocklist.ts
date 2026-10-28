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

export const get: InstantlyEndpoints['blocklistGet'] = (ctx, input) =>
	call(
		ctx,
		'blocklistGet',
		'blocklist.get',
		input,
		({ id }) => ({
			method: 'GET',
			path: `/block-lists-entries/${segment(id)}`,
		}),
		{ log: ({ id }) => ({ id }) },
	);

export const update: InstantlyEndpoints['blocklistUpdate'] = (ctx, input) =>
	call(
		ctx,
		'blocklistUpdate',
		'blocklist.update',
		input,
		({ id, ...body }) => ({
			method: 'PATCH',
			path: `/block-lists-entries/${segment(id)}`,
			body,
		}),
		{ log: ({ id }) => ({ id }) },
	);

export const deleteAll: InstantlyEndpoints['blocklistDeleteAll'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'blocklistDeleteAll',
		'blocklist.deleteAll',
		input,
		(query) => ({ method: 'DELETE', path: '/block-lists-entries', query }),
		{ log: (_, result) => ({ count: result.length }) },
	);

export const addMany: InstantlyEndpoints['blocklistAddMany'] = (ctx, input) =>
	call(
		ctx,
		'blocklistAddMany',
		'blocklist.addMany',
		input,
		(body) => ({
			method: 'POST',
			path: '/block-lists-entries/bulk-create',
			body,
		}),
		{ log: (_, result) => ({ count: result.items.length }) },
	);

export const removeMany: InstantlyEndpoints['blocklistRemoveMany'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'blocklistRemoveMany',
		'blocklist.removeMany',
		input,
		(body) => ({
			method: 'POST',
			path: '/block-lists-entries/bulk-delete',
			body,
		}),
		{ log: (_, result) => ({ count: result.length }) },
	);

export const downloadCsv: InstantlyEndpoints['blocklistDownloadCsv'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'blocklistDownloadCsv',
		'blocklist.downloadCsv',
		input,
		(query) => ({
			method: 'GET',
			path: '/block-lists-entries/download',
			query,
		}),
		{},
	);
