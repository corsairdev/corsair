import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const list: HunterioEndpoints['companyListFoldersList'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.companyListFoldersList.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companyListFoldersList']
	>('/company-lists/folders', ctx.key, {
		method: 'GET',
		query: { limit: parsed.limit, offset: parsed.offset },
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.companyListFoldersList.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.companyListFolders.list',
		{},
		'completed',
	);

	return parsedResponse;
};

export const create: HunterioEndpoints['companyListFoldersCreate'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.companyListFoldersCreate.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companyListFoldersCreate']
	>('/company-lists/folders', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.companyListFoldersCreate.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.companyListFolders.create',
		{},
		'completed',
	);

	return parsedResponse;
};

export const get: HunterioEndpoints['companyListFoldersGet'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.companyListFoldersGet.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companyListFoldersGet']
	>(`/company-lists/folders/${parsed.id}`, ctx.key, { method: 'GET' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.companyListFoldersGet.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.companyListFolders.get',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const update: HunterioEndpoints['companyListFoldersUpdate'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.companyListFoldersUpdate.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companyListFoldersUpdate']
	>(`/company-lists/folders/${id}`, ctx.key, { method: 'PATCH', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.companyListFoldersUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.companyListFolders.update',
		{ id },
		'completed',
	);

	return parsedResponse;
};

export const replace: HunterioEndpoints['companyListFoldersReplace'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.companyListFoldersReplace.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companyListFoldersReplace']
	>(`/company-lists/folders/${id}`, ctx.key, { method: 'PUT', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.companyListFoldersReplace.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.companyListFolders.replace',
		{ id },
		'completed',
	);

	return parsedResponse;
};

export const remove: HunterioEndpoints['companyListFoldersDelete'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.companyListFoldersDelete.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['companyListFoldersDelete']
	>(`/company-lists/folders/${parsed.id}`, ctx.key, { method: 'DELETE' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.companyListFoldersDelete.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.companyListFolders.delete',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};
