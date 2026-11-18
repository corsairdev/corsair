import type { InstantlyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';

export const create: InstantlyEndpoints['customTagsCreate'] = (ctx, input) =>
	call(
		ctx,
		'customTagsCreate',
		'customTags.create',
		input,
		(body) => ({ method: 'POST', path: '/custom-tags', body }),
		{},
	);

export const list: InstantlyEndpoints['customTagsList'] = (ctx, input) =>
	call(
		ctx,
		'customTagsList',
		'customTags.list',
		input,
		(query) => ({ method: 'GET', path: '/custom-tags', query }),
		{ log: (_, result) => ({ count: result.items.length }) },
	);

export const get: InstantlyEndpoints['customTagsGet'] = (ctx, input) =>
	call(
		ctx,
		'customTagsGet',
		'customTags.get',
		input,
		({ id }) => ({ method: 'GET', path: `/custom-tags/${segment(id)}` }),
		{ log: ({ id }) => ({ id }) },
	);

export const update: InstantlyEndpoints['customTagsUpdate'] = (ctx, input) =>
	call(
		ctx,
		'customTagsUpdate',
		'customTags.update',
		input,
		({ id, ...body }) => ({
			method: 'PATCH',
			path: `/custom-tags/${segment(id)}`,
			body,
		}),
		{ log: ({ id }) => ({ id }) },
	);

export const remove: InstantlyEndpoints['customTagsDelete'] = (ctx, input) =>
	call(
		ctx,
		'customTagsDelete',
		'customTags.delete',
		input,
		({ id }) => ({ method: 'DELETE', path: `/custom-tags/${segment(id)}` }),
		{ log: ({ id }) => ({ id }) },
	);

export const toggleResource: InstantlyEndpoints['customTagsToggleResource'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'customTagsToggleResource',
		'customTags.toggleResource',
		input,
		(body) => ({ method: 'POST', path: '/custom-tags/toggle-resource', body }),
		{},
	);

export const listMappings: InstantlyEndpoints['customTagMappingsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'customTagMappingsList',
		'customTagMappings.list',
		input,
		(query) => ({ method: 'GET', path: '/custom-tag-mappings', query }),
		{ log: (_, result) => ({ count: result.items.length }) },
	);
