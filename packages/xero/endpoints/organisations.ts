import { logEventFromContext } from 'corsair/core';
import { makeXeroRequest } from '../client';
import type { XeroEndpoints } from '../index';
import type { XeroEndpointOutputs } from './types';

export const get: XeroEndpoints['organisationsGet'] = async (ctx, input) => {
	const { tenantId = ctx.options.tenantId } = input;
	const response = await makeXeroRequest<
		XeroEndpointOutputs['organisationsGet']
	>('Organisation', ctx.key, {
		method: 'GET',
		tenantId,
	});

	await logEventFromContext(
		ctx,
		'xero.organisations.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const Organisations = {
	get,
};
