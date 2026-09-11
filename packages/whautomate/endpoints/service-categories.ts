import { logEventFromContext } from 'corsair/core';
import type { WhautomateHandler } from '../client';
import { makeWhautomateRequest, resolveApiHost } from '../client';

import type {
	WhautomateEndpointInputs,
	WhautomateEndpointOutputs,
} from './types';
import { WhautomateEndpointOutputSchemas } from './types';

export const getServiceCategories: WhautomateHandler<
	WhautomateEndpointInputs['getServiceCategories'],
	WhautomateEndpointOutputs['getServiceCategories']
> = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page !== undefined) query.page = input.page;
	if (input.limit !== undefined) query.limit = input.limit;

	const result = await makeWhautomateRequest<
		WhautomateEndpointOutputs['getServiceCategories']
	>(
		await resolveApiHost(ctx),
		ctx.key,
		'/serviceCategories',
		WhautomateEndpointOutputSchemas.getServiceCategories,
		{
			method: 'GET',
			query,
		},
	);

	await logEventFromContext(
		ctx,
		'whautomate.serviceCategories.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteServiceCategory: WhautomateHandler<
	WhautomateEndpointInputs['deleteServiceCategory'],
	WhautomateEndpointOutputs['deleteServiceCategory']
> = async (ctx, input) => {
	const result = await makeWhautomateRequest<
		WhautomateEndpointOutputs['deleteServiceCategory']
	>(
		await resolveApiHost(ctx),
		ctx.key,
		`/serviceCategories/${input.id}`,
		WhautomateEndpointOutputSchemas.deleteServiceCategory,
		{
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'whautomate.serviceCategories.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const ServiceCategories = {
	getServiceCategories,
	deleteServiceCategory,
};
