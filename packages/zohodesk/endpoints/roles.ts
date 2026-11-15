import type { ZohoDeskEndpoints } from '..';
import { csv, zohoDeskCall } from './call';
import {
	ZohoDeskEndpointInputSchemas,
	ZohoDeskEndpointOutputSchemas,
} from './types';

export const list: ZohoDeskEndpoints['rolesList'] = (ctx, input) =>
	zohoDeskCall(ctx, input, {
		event: 'zohodesk.roles.list',
		input: ZohoDeskEndpointInputSchemas.rolesList,
		output: ZohoDeskEndpointOutputSchemas.rolesList,
		empty: { data: [] },
		toRequest: ({ from, limit, isVisible, isDefault, searchStr }) => ({
			path: '/roles',
			query: { from, limit, isVisible, isDefault, searchStr },
		}),
	});

export const listByIds: ZohoDeskEndpoints['rolesListByIds'] = (ctx, input) =>
	zohoDeskCall(ctx, input, {
		event: 'zohodesk.roles.listByIds',
		input: ZohoDeskEndpointInputSchemas.rolesListByIds,
		output: ZohoDeskEndpointOutputSchemas.rolesListByIds,
		empty: { data: [] },
		toRequest: ({ roleIds }) => ({
			path: '/rolesByIds',
			query: { roleIds: csv(roleIds) },
		}),
	});
