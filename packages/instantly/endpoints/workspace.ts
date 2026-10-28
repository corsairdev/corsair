import type { InstantlyEndpoints } from '..';
import { call } from './call';

export const get: InstantlyEndpoints['workspaceGet'] = (ctx, input) =>
	call(
		ctx,
		'workspaceGet',
		'workspace.get',
		input,
		() => ({ method: 'GET', path: '/workspaces/current' }),
		{ log: (_, workspace) => ({ planId: workspace.plan_id }) },
	);
