import type { InstantlyEndpoints } from '..';
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
