import { logEventFromContext } from 'corsair/core';
import { makeRootlyRequest } from '../client';
import type { RootlyEndpoints } from '../index';
import type { RootlyEndpointOutputs } from './types';

export const actionItemsList: RootlyEndpoints['actionItemsList'] = async (
	ctx,
	input,
) => {
	const result = await makeRootlyRequest<
		RootlyEndpointOutputs['actionItemsList']
	>(
		`incidents/${encodeURIComponent(input.incident_id)}/action_items`,
		ctx.key,
		{
			method: 'GET',
			query: {
				include: input.include,
				'page[number]': input.page_number,
				'page[size]': input.page_size,
			},
		},
	);
	await logEventFromContext(
		ctx,
		'rootly.actionItems.list',
		{ incident_id: input.incident_id },
		'completed',
	);
	return result;
};

export const actionItemsGet: RootlyEndpoints['actionItemGet'] = async (
	ctx,
	input,
) => {
	const result = await makeRootlyRequest<
		RootlyEndpointOutputs['actionItemGet']
	>(`action_items/${encodeURIComponent(input.id)}`, ctx.key);
	await logEventFromContext(
		ctx,
		'rootly.actionItems.get',
		{ id: input.id },
		'completed',
	);
	return result;
};

export const actionItemsDelete: RootlyEndpoints['actionItemDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeRootlyRequest<
		RootlyEndpointOutputs['actionItemDelete']
	>(`action_items/${encodeURIComponent(input.id)}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'rootly.actionItems.delete',
		{ id: input.id },
		'completed',
	);
	return result;
};

export const incidentsGet: RootlyEndpoints['incidentGet'] = async (
	ctx,
	input,
) => {
	const result = await makeRootlyRequest<RootlyEndpointOutputs['incidentGet']>(
		`incidents/${encodeURIComponent(input.id)}`,
		ctx.key,
	);
	await logEventFromContext(
		ctx,
		'rootly.incidents.get',
		{ id: input.id },
		'completed',
	);
	return result;
};

export const incidentsUpdate: RootlyEndpoints['incidentUpdate'] = async (
	ctx,
	input,
) => {
	const { id, ...attributes } = input;
	const result = await makeRootlyRequest<
		RootlyEndpointOutputs['incidentUpdate']
	>(`incidents/${encodeURIComponent(id)}`, ctx.key, {
		method: 'PUT',
		body: {
			data: {
				type: 'incidents',
				attributes,
			},
		},
	});
	await logEventFromContext(
		ctx,
		'rootly.incidents.update',
		{ id, fields: Object.keys(attributes) },
		'completed',
	);
	return result;
};

export const incidentsDelete: RootlyEndpoints['incidentDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeRootlyRequest<
		RootlyEndpointOutputs['incidentDelete']
	>(`incidents/${encodeURIComponent(input.id)}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'rootly.incidents.delete',
		{ id: input.id },
		'completed',
	);
	return result;
};
