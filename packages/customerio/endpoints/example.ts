import { logEventFromContext } from 'corsair/core';
import type { CustomerioEndpoints } from '..';
import type { CustomerioEndpointOutputs } from './types';
import { makeCustomerioRequest } from '../client';

export const getCustomerAttributes: CustomerioEndpoints['getCustomerAttributes'] = async (
	ctx,
	input,
) => {
	const response = await makeCustomerioRequest<
		CustomerioEndpointOutputs['getCustomerAttributes']
	>(`/v1/customers/${input.customerId}/attributes`, ctx.key, {
		method: 'GET',
		query: input.idType ? { id_type: input.idType } : undefined,
	});

	await logEventFromContext(
		ctx,
		'customerio.customer.getAttributes',
		{ ...input },
		'completed',
	);

	return response;
};