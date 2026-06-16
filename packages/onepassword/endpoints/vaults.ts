import { logEventFromContext } from 'corsair/core';
import type { OnePasswordEndpoints } from '..';
import { makeOnePasswordRequest } from '../client';
import type { OnePasswordEndpointOutputs } from './types';

export const list: OnePasswordEndpoints['vaultsList'] = async (
	ctx,
	_input,
) => {
	const response = await makeOnePasswordRequest<
		OnePasswordEndpointOutputs['vaultsList']
	>(ctx.options.connectUrl, 'v1/vaults', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'onepassword.vaults.list',
		{},
		'completed',
	);
	return response;
};

export const get: OnePasswordEndpoints['vaultsGet'] = async (
	ctx,
	input,
) => {
	const response = await makeOnePasswordRequest<
		OnePasswordEndpointOutputs['vaultsGet']
	>(ctx.options.connectUrl, `v1/vaults/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'onepassword.vaults.get',
		input,
		'completed',
	);
	return response;
};
