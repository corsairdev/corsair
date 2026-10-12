import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import type { CodaEndpointOutputs } from './types';

const list: CodaEndpoints['foldersList'] = async (ctx, input) => {
	const response = await makeCodaRequest<CodaEndpointOutputs['foldersList']>(
		'folders',
		ctx.key,
		{ method: 'GET', query: input },
	);
	await logEventFromContext(
		ctx,
		'coda.folders.list',
		{ ...input },
		'completed',
	);
	return response;
};

const get: CodaEndpoints['foldersGet'] = async (ctx, input) => {
	const { folderId } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['foldersGet']>(
		`folders/${encodeURIComponent(folderId)}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'coda.folders.get', { ...input }, 'completed');
	return response;
};

const create: CodaEndpoints['foldersCreate'] = async (ctx, input) => {
	const response = await makeCodaRequest<CodaEndpointOutputs['foldersCreate']>(
		'folders',
		ctx.key,
		{ method: 'POST', body: input },
	);
	await logEventFromContext(
		ctx,
		'coda.folders.create',
		{ ...input },
		'completed',
	);
	return response;
};

const update: CodaEndpoints['foldersUpdate'] = async (ctx, input) => {
	const { folderId, ...body } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['foldersUpdate']>(
		`folders/${encodeURIComponent(folderId)}`,
		ctx.key,
		{ method: 'PATCH', body },
	);
	await logEventFromContext(
		ctx,
		'coda.folders.update',
		{ ...input },
		'completed',
	);
	return response;
};

const deleteOne: CodaEndpoints['foldersDelete'] = async (ctx, input) => {
	const { folderId } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['foldersDelete']>(
		`folders/${encodeURIComponent(folderId)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'coda.folders.delete',
		{ ...input },
		'completed',
	);
	return response;
};

export const Folders = {
	list,
	get,
	create,
	update,
	delete: deleteOne,
};
