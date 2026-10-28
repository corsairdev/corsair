import type { InstantlyEndpoints } from '..';
import { call } from './call';

export const list: InstantlyEndpoints['engageItemsList'] = (ctx, input) =>
	call(
		ctx,
		'engageItemsList',
		'engageItems.list',
		input,
		(query) => ({ method: 'GET', path: '/agent-items', query }),
		{ log: (_, result) => ({ count: result.items.length }) },
	);

export const deleteMany: InstantlyEndpoints['engageItemsDeleteMany'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'engageItemsDeleteMany',
		'engageItems.deleteMany',
		input,
		(body) => ({ method: 'POST', path: '/agent-items/bulk-delete', body }),
		{},
	);
