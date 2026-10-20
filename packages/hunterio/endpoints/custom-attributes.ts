import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const list: HunterioEndpoints['customAttributesList'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.customAttributesList.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['customAttributesList']
	>('/leads_custom_attributes', ctx.key, { method: 'GET' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.customAttributesList.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.customAttributes.list',
		{},
		'completed',
	);

	return parsedResponse;
};

export const create: HunterioEndpoints['customAttributesCreate'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.customAttributesCreate.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['customAttributesCreate']
	>('/leads_custom_attributes', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.customAttributesCreate.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.customAttributes.create',
		{},
		'completed',
	);

	return parsedResponse;
};

export const get: HunterioEndpoints['customAttributesGet'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.customAttributesGet.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['customAttributesGet']
	>(`/leads_custom_attributes/${parsed.id}`, ctx.key, { method: 'GET' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.customAttributesGet.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.customAttributes.get',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const update: HunterioEndpoints['customAttributesUpdate'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.customAttributesUpdate.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['customAttributesUpdate']
	>(`/leads_custom_attributes/${id}`, ctx.key, { method: 'PATCH', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.customAttributesUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.customAttributes.update',
		{ id },
		'completed',
	);

	return parsedResponse;
};

export const replace: HunterioEndpoints['customAttributesReplace'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.customAttributesReplace.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['customAttributesReplace']
	>(`/leads_custom_attributes/${id}`, ctx.key, { method: 'PUT', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.customAttributesReplace.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.customAttributes.replace',
		{ id },
		'completed',
	);

	return parsedResponse;
};

export const remove: HunterioEndpoints['customAttributesDelete'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.customAttributesDelete.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['customAttributesDelete']
	>(`/leads_custom_attributes/${parsed.id}`, ctx.key, { method: 'DELETE' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.customAttributesDelete.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.customAttributes.delete',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};
