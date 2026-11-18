import { logEventFromContext } from 'corsair/core';
import {
	getTurbotPipesAvatarUrl,
	makeTurbotPipesRequest,
	pathSegment,
	pickQuery,
} from '../client';
import type { TurbotPipesEndpoints } from '../index';
import { eventIdentifiers } from './events';
import type { TurbotPipesEndpointOutputs } from './types';

export const getTenant: TurbotPipesEndpoints['getTenant'] = async (
	ctx,
	input,
) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['getTenant']
	>(`tenant/${pathSegment(input.tenant_handle)}`, ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'turbotpipes.tenants.get',
		eventIdentifiers(input),
		'completed',
	);
	return response;
};

export const getTenantAvatar: TurbotPipesEndpoints['getTenantAvatar'] = async (
	ctx,
	input,
) => {
	// Returns the resolved image URL instead of downloading bytes: the shared
	// HTTP client parses non-JSON bodies as text and would corrupt the image.
	const response = await getTurbotPipesAvatarUrl(
		`tenant/${pathSegment(input.tenant_handle)}/avatar`,
		ctx.key,
	);
	await logEventFromContext(
		ctx,
		'turbotpipes.tenants.get_avatar',
		eventIdentifiers(input),
		'completed',
	);
	return response;
};

export const getTenantSettings: TurbotPipesEndpoints['getTenantSettings'] =
	async (ctx, _input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getTenantSettings']
		>('settings', ctx.key, { method: 'GET' });
		await logEventFromContext(
			ctx,
			'turbotpipes.tenants.get_settings',
			{},
			'completed',
		);
		return response;
	};

export const listTenants: TurbotPipesEndpoints['listTenants'] = async (
	ctx,
	input,
) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['listTenants']
	>('tenant', ctx.key, {
		method: 'GET',
		query: pickQuery(input, ['limit', 'next_token']),
	});
	await logEventFromContext(
		ctx,
		'turbotpipes.tenants.list',
		eventIdentifiers(input),
		'completed',
	);
	return response;
};
