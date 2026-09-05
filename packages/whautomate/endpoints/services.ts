import { logEventFromContext } from 'corsair/core';
import { makeWhautomateRequest } from '../client';
import type { WhautomateEndpoints } from '../index';
import type { WhautomateEndpointOutputs } from './types';
import { WhautomateEndpointOutputSchemas } from './types';

export const getServices: WhautomateEndpoints['getServices'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page) query.page = input.page;
	if (input.limit) query.limit = input.limit;
	if (input.categoryId) query.categoryId = input.categoryId;
	if (input.search) query.search = input.search;
	if (input.isActive !== undefined) query.isActive = input.isActive;

	const result = await makeWhautomateRequest<
		WhautomateEndpointOutputs['getServices']
	>(
		ctx.options.apiHost!,
		ctx.key,
		'/services',
		WhautomateEndpointOutputSchemas.getServices,
		{
			method: 'GET',
			query,
		},
	);

	await logEventFromContext(
		ctx,
		'whautomate.services.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const getServiceById: WhautomateEndpoints['getServiceById'] = async (
	ctx,
	input,
) => {
	const result = await makeWhautomateRequest<
		WhautomateEndpointOutputs['getServiceById']
	>(
		ctx.options.apiHost!,
		ctx.key,
		`/services/${input.id}`,
		WhautomateEndpointOutputSchemas.getServiceById,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'whautomate.services.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const updateService: WhautomateEndpoints['updateService'] = async (
	ctx,
	input,
) => {
	const { id, ...body } = input;
	const result = await makeWhautomateRequest<
		WhautomateEndpointOutputs['updateService']
	>(
		ctx.options.apiHost!,
		ctx.key,
		`/services/${id}`,
		WhautomateEndpointOutputSchemas.updateService,
		{
			method: 'PATCH',
			body,
		},
	);

	await logEventFromContext(
		ctx,
		'whautomate.services.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const Services = {
	getServices,
	getServiceById,
	updateService,
};
