import { logEventFromContext } from 'corsair/core';
import { makeWhautomateRequest, resolveApiHost } from '../client';
import type { WhautomateEndpoints } from '../index';
import type { WhautomateEndpointOutputs } from './types';
import { WhautomateEndpointOutputSchemas } from './types';

export const getServices: WhautomateEndpoints['getServices'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page !== undefined) query.page = input.page;
	if (input.limit !== undefined) query.limit = input.limit;
	if (input.categoryId !== undefined) query.categoryId = input.categoryId;
	if (input.search !== undefined) query.search = input.search;
	if (input.isActive !== undefined) query.isActive = input.isActive;

	const result = await makeWhautomateRequest<
		WhautomateEndpointOutputs['getServices']
	>(
		await resolveApiHost(ctx),
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
		await resolveApiHost(ctx),
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
		await resolveApiHost(ctx),
		ctx.key,
		`/services/${id}`,
		WhautomateEndpointOutputSchemas.updateService,
		{
			method: 'PUT',
			body,
		},
	);

	await logEventFromContext(
		ctx,
		'whautomate.services.update',
		{ id: input.id },
		'completed',
	);
	return result;
};

export const Services = {
	getServices,
	getServiceById,
	updateService,
};
