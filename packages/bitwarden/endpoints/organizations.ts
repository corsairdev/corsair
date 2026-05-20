import { logEventFromContext } from 'corsair/core';
import type { BitwardenEndpoints } from '..';
import { makeBitwardenRequest } from '../client';
import type { BitwardenEndpointOutputs } from './types';

export const list: BitwardenEndpoints['organizationsList'] = async (
	ctx,
	_input,
) => {
	const response = await makeBitwardenRequest<
		BitwardenEndpointOutputs['organizationsList']
	>('/organizations', ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'bitwarden.organizations.list',
		{},
		'completed',
	);
	return response;
};

export const get: BitwardenEndpoints['organizationsGet'] = async (
	ctx,
	input,
) => {
	const response = await makeBitwardenRequest<
		BitwardenEndpointOutputs['organizationsGet']
	>(`/organizations/${input.id}`, ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'bitwarden.organizations.get',
		input,
		'completed',
	);
	return response;
};
