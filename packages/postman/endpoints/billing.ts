import { logEventFromContext } from 'corsair/core';
import type { PostmanEndpoints } from '..';
import { makePostmanRequest } from '../client';
import type { PostmanEndpointOutputs } from './types';

export const getAccount: PostmanEndpoints['billingGetAccount'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['billingGetAccount']
	>('/accounts', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'postman.billing.getAccount',
		{ ...input },
		'completed',
	);
	return response;
};

export const listInvoices: PostmanEndpoints['billingListInvoices'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['billingListInvoices']
	>('/accounts/{accountId}/invoices', ctx.key, {
		method: 'GET',
		path: {
			accountId: input.accountId,
		},
		query: {
			status: input.status,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.billing.listInvoices',
		{ ...input },
		'completed',
	);
	return response;
};
