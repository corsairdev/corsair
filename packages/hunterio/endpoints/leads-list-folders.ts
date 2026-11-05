import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const list: HunterioEndpoints['leadsListFoldersList'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.leadsListFoldersList.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsListFoldersList']
	>('/leads_lists/folders', ctx.key, {
		method: 'GET',
		query: { limit: parsed.limit, offset: parsed.offset },
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsListFoldersList.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.leadsListFolders.list',
		{},
		'completed',
	);

	return parsedResponse;
};

export const create: HunterioEndpoints['leadsListFoldersCreate'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.leadsListFoldersCreate.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsListFoldersCreate']
	>('/leads_lists/folders', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsListFoldersCreate.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.leadsListFolders.create',
		{},
		'completed',
	);

	return parsedResponse;
};

export const get: HunterioEndpoints['leadsListFoldersGet'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.leadsListFoldersGet.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsListFoldersGet']
	>(`/leads_lists/folders/${parsed.id}`, ctx.key, { method: 'GET' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsListFoldersGet.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.leadsListFolders.get',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const update: HunterioEndpoints['leadsListFoldersUpdate'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.leadsListFoldersUpdate.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsListFoldersUpdate']
	>(`/leads_lists/folders/${id}`, ctx.key, { method: 'PATCH', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsListFoldersUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.leadsListFolders.update',
		{ id },
		'completed',
	);

	return parsedResponse;
};

export const replace: HunterioEndpoints['leadsListFoldersReplace'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.leadsListFoldersReplace.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsListFoldersReplace']
	>(`/leads_lists/folders/${id}`, ctx.key, { method: 'PUT', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsListFoldersReplace.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.leadsListFolders.replace',
		{ id },
		'completed',
	);

	return parsedResponse;
};

export const remove: HunterioEndpoints['leadsListFoldersDelete'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.leadsListFoldersDelete.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsListFoldersDelete']
	>(`/leads_lists/folders/${parsed.id}`, ctx.key, { method: 'DELETE' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsListFoldersDelete.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.leadsListFolders.delete',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};
