import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const list: HunterioEndpoints['companyListsList'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.companyListsList.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companyListsList']
	>('/company-lists', ctx.key, {
		method: 'GET',
		query: { limit: parsed.limit, offset: parsed.offset },
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.companyListsList.parse(response);

	await logEventFromContext(ctx, 'hunterio.companyLists.list', {}, 'completed');

	return parsedResponse;
};

export const create: HunterioEndpoints['companyListsCreate'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.companyListsCreate.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companyListsCreate']
	>('/company-lists', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.companyListsCreate.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.companyLists.create',
		{},
		'completed',
	);

	return parsedResponse;
};

export const get: HunterioEndpoints['companyListsGet'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.companyListsGet.parse(input);
	const { id, ...query } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companyListsGet']
	>(`/company-lists/${id}`, ctx.key, { method: 'GET', query });

	const parsedResponse =
		HunterioEndpointOutputSchemas.companyListsGet.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.companyLists.get',
		{ id },
		'completed',
	);

	return parsedResponse;
};

export const update: HunterioEndpoints['companyListsUpdate'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.companyListsUpdate.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companyListsUpdate']
	>(`/company-lists/${id}`, ctx.key, { method: 'PATCH', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.companyListsUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.companyLists.update',
		{ id },
		'completed',
	);

	return parsedResponse;
};

export const replace: HunterioEndpoints['companyListsReplace'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.companyListsReplace.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companyListsReplace']
	>(`/company-lists/${id}`, ctx.key, { method: 'PUT', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.companyListsReplace.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.companyLists.replace',
		{ id },
		'completed',
	);

	return parsedResponse;
};

export const remove: HunterioEndpoints['companyListsDelete'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.companyListsDelete.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companyListsDelete']
	>(`/company-lists/${parsed.id}`, ctx.key, { method: 'DELETE' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.companyListsDelete.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.companyLists.delete',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const addCompany: HunterioEndpoints['companyListsAddCompany'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.companyListsAddCompany.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companyListsAddCompany']
	>(`/company-lists/${parsed.company_list_id}/companies`, ctx.key, {
		method: 'POST',
		body: { company_id: parsed.company_id },
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.companyListsAddCompany.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.companyLists.addCompany',
		{ companyListId: parsed.company_list_id },
		'completed',
	);

	return parsedResponse;
};

export const removeCompany: HunterioEndpoints['companyListsRemoveCompany'] =
	async (ctx, input) => {
		const parsed =
			HunterioEndpointInputSchemas.companyListsRemoveCompany.parse(input);

		const response = await makeHunterioRequest<
			HunterioEndpointOutputs['companyListsRemoveCompany']
		>(
			`/company-lists/${parsed.company_list_id}/companies/${parsed.company_id}`,
			ctx.key,
			{ method: 'DELETE' },
		);

		const parsedResponse =
			HunterioEndpointOutputSchemas.companyListsRemoveCompany.parse(response);

		await logEventFromContext(
			ctx,
			'hunterio.companyLists.removeCompany',
			{ companyListId: parsed.company_list_id },
			'completed',
		);

		return parsedResponse;
	};

export const favorite: HunterioEndpoints['companyListsFavorite'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.companyListsFavorite.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companyListsFavorite']
	>(`/company-lists/${parsed.id}/favorite`, ctx.key, { method: 'POST' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.companyListsFavorite.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.companyLists.favorite',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const unfavorite: HunterioEndpoints['companyListsUnfavorite'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.companyListsUnfavorite.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companyListsUnfavorite']
	>(`/company-lists/${parsed.id}/favorite`, ctx.key, { method: 'DELETE' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.companyListsUnfavorite.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.companyLists.unfavorite',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};
