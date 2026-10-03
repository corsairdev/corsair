import { logEventFromContext } from 'corsair/core';
import type { TurbotPipesEndpoints } from '../index';
import type { TurbotPipesEndpointOutputs } from './types';
import { makeTurbotPipesRequest } from '../client';

export const getTenant: TurbotPipesEndpoints['getTenant'] = async (ctx, input) => {
	const response = await makeTurbotPipesRequest<TurbotPipesEndpointOutputs['getTenant']>(
		`tenant/${input.tenant_handle}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'turbotpipes.tenants.get', { ...input }, 'completed');
	return response;
};

export const getTenantAvatar: TurbotPipesEndpoints['getTenantAvatar'] = async (ctx, input) => {
	const response = await makeTurbotPipesRequest<TurbotPipesEndpointOutputs['getTenantAvatar']>(
		`tenant/${input.tenant_handle}/avatar`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'turbotpipes.tenants.get_avatar', { ...input }, 'completed');
	return response;
};

export const getTenantSettings: TurbotPipesEndpoints['getTenantSettings'] = async (ctx, input) => {
	const response = await makeTurbotPipesRequest<TurbotPipesEndpointOutputs['getTenantSettings']>(
		`tenant/${input.tenant_handle}/settings`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'turbotpipes.tenants.get_settings', { ...input }, 'completed');
	return response;
};

export const listTenants: TurbotPipesEndpoints['listTenants'] = async (ctx, input) => {
	const response = await makeTurbotPipesRequest<TurbotPipesEndpointOutputs['listTenants']>(
		'tenant',
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'turbotpipes.tenants.list', { ...input }, 'completed');
	return response;
};
