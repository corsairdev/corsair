import type { InstantlyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';

export const list: InstantlyEndpoints['leadListsList'] = (ctx, input) =>
	call(
		ctx,
		'leadListsList',
		'leadLists.list',
		input,
		(query) => ({ method: 'GET', path: '/lead-lists', query }),
		{ log: (_, result) => ({ count: result.items.length }) },
	);

export const create: InstantlyEndpoints['leadListsCreate'] = (ctx, input) =>
	call(
		ctx,
		'leadListsCreate',
		'leadLists.create',
		input,
		(body) => ({ method: 'POST', path: '/lead-lists', body }),
		{ log: (_, result) => ({ listId: result.id }) },
	);

export const get: InstantlyEndpoints['leadListsGet'] = (ctx, input) =>
	call(
		ctx,
		'leadListsGet',
		'leadLists.get',
		input,
		({ id }) => ({ method: 'GET', path: `/lead-lists/${segment(id)}` }),
		{ log: ({ id }) => ({ id }) },
	);

export const update: InstantlyEndpoints['leadListsUpdate'] = (ctx, input) =>
	call(
		ctx,
		'leadListsUpdate',
		'leadLists.update',
		input,
		({ id, ...body }) => ({
			method: 'PATCH',
			path: `/lead-lists/${segment(id)}`,
			body,
		}),
		{ log: ({ id }) => ({ id }) },
	);

export const remove: InstantlyEndpoints['leadListsDelete'] = (ctx, input) =>
	call(
		ctx,
		'leadListsDelete',
		'leadLists.delete',
		input,
		({ id }) => ({ method: 'DELETE', path: `/lead-lists/${segment(id)}` }),
		{ log: ({ id }) => ({ id }) },
	);

export const getVerificationStats: InstantlyEndpoints['leadListsGetVerificationStats'] =
	(ctx, input) =>
		call(
			ctx,
			'leadListsGetVerificationStats',
			'leadLists.getVerificationStats',
			input,
			({ id }) => ({
				method: 'GET',
				path: `/lead-lists/${segment(id)}/verification-stats`,
			}),
			{ log: ({ id }) => ({ id }) },
		);
