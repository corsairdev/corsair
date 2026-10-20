import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const list: HunterioEndpoints['companyTagsList'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.companyTagsList.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companyTagsList']
	>('/company-tags', ctx.key, {
		method: 'GET',
		query: { limit: parsed.limit, offset: parsed.offset },
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.companyTagsList.parse(response);

	await logEventFromContext(ctx, 'hunterio.companyTags.list', {}, 'completed');

	return parsedResponse;
};

export const create: HunterioEndpoints['companyTagsCreate'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.companyTagsCreate.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companyTagsCreate']
	>('/company-tags', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.companyTagsCreate.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.companyTags.create',
		{},
		'completed',
	);

	return parsedResponse;
};

export const get: HunterioEndpoints['companyTagsGet'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.companyTagsGet.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companyTagsGet']
	>(`/company-tags/${parsed.id}`, ctx.key, { method: 'GET' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.companyTagsGet.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.companyTags.get',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const update: HunterioEndpoints['companyTagsUpdate'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.companyTagsUpdate.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companyTagsUpdate']
	>(`/company-tags/${id}`, ctx.key, { method: 'PATCH', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.companyTagsUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.companyTags.update',
		{ id },
		'completed',
	);

	return parsedResponse;
};

export const replace: HunterioEndpoints['companyTagsReplace'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.companyTagsReplace.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companyTagsReplace']
	>(`/company-tags/${id}`, ctx.key, { method: 'PUT', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.companyTagsReplace.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.companyTags.replace',
		{ id },
		'completed',
	);

	return parsedResponse;
};

export const remove: HunterioEndpoints['companyTagsDelete'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.companyTagsDelete.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companyTagsDelete']
	>(`/company-tags/${parsed.id}`, ctx.key, { method: 'DELETE' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.companyTagsDelete.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.companyTags.delete',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};
