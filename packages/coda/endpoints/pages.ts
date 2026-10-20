import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import { savePages } from './persist';
import type { CodaEndpointOutputs } from './types';

const list: CodaEndpoints['pagesList'] = async (ctx, input) => {
	const { docId, ...query } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['pagesList']>(
		`docs/${encodeURIComponent(docId)}/pages`,
		ctx.key,
		{ method: 'GET', query },
	);
	await savePages(ctx, response.items);
	await logEventFromContext(ctx, 'coda.pages.list', { ...input }, 'completed');
	return response;
};

const get: CodaEndpoints['pagesGet'] = async (ctx, input) => {
	const { docId, pageIdOrName } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['pagesGet']>(
		`docs/${encodeURIComponent(docId)}/pages/${encodeURIComponent(pageIdOrName)}`,
		ctx.key,
		{ method: 'GET' },
	);
	await savePages(ctx, [response]);
	await logEventFromContext(ctx, 'coda.pages.get', { ...input }, 'completed');
	return response;
};

const create: CodaEndpoints['pagesCreate'] = async (ctx, input) => {
	const { docId, ...body } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['pagesCreate']>(
		`docs/${encodeURIComponent(docId)}/pages`,
		ctx.key,
		{ method: 'POST', body },
	);
	await logEventFromContext(
		ctx,
		'coda.pages.create',
		{ ...input },
		'completed',
	);
	return response;
};

const update: CodaEndpoints['pagesUpdate'] = async (ctx, input) => {
	const { docId, pageIdOrName, ...body } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['pagesUpdate']>(
		`docs/${encodeURIComponent(docId)}/pages/${encodeURIComponent(pageIdOrName)}`,
		ctx.key,
		{ method: 'PUT', body },
	);
	await logEventFromContext(
		ctx,
		'coda.pages.update',
		{ ...input },
		'completed',
	);
	return response;
};

const deleteOne: CodaEndpoints['pagesDelete'] = async (ctx, input) => {
	const { docId, pageIdOrName } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['pagesDelete']>(
		`docs/${encodeURIComponent(docId)}/pages/${encodeURIComponent(pageIdOrName)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'coda.pages.delete',
		{ ...input },
		'completed',
	);
	return response;
};

const listContent: CodaEndpoints['pagesListContent'] = async (ctx, input) => {
	const { docId, pageIdOrName, ...query } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['pagesListContent']
	>(
		`docs/${encodeURIComponent(docId)}/pages/${encodeURIComponent(pageIdOrName)}/content`,
		ctx.key,
		{ method: 'GET', query },
	);
	await logEventFromContext(
		ctx,
		'coda.pages.listContent',
		{ ...input },
		'completed',
	);
	return response;
};

const deleteContent: CodaEndpoints['pagesDeleteContent'] = async (
	ctx,
	input,
) => {
	const { docId, pageIdOrName, ...body } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['pagesDeleteContent']
	>(
		`docs/${encodeURIComponent(docId)}/pages/${encodeURIComponent(pageIdOrName)}/content`,
		ctx.key,
		{ method: 'DELETE', body },
	);
	await logEventFromContext(
		ctx,
		'coda.pages.deleteContent',
		{ ...input },
		'completed',
	);
	return response;
};

const beginExport: CodaEndpoints['pagesBeginExport'] = async (ctx, input) => {
	const { docId, pageIdOrName, ...body } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['pagesBeginExport']
	>(
		`docs/${encodeURIComponent(docId)}/pages/${encodeURIComponent(pageIdOrName)}/export`,
		ctx.key,
		{ method: 'POST', body },
	);
	await logEventFromContext(
		ctx,
		'coda.pages.beginExport',
		{ ...input },
		'completed',
	);
	return response;
};

const getExportStatus: CodaEndpoints['pagesGetExportStatus'] = async (
	ctx,
	input,
) => {
	const { docId, pageIdOrName, requestId } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['pagesGetExportStatus']
	>(
		`docs/${encodeURIComponent(docId)}/pages/${encodeURIComponent(pageIdOrName)}/export/${encodeURIComponent(requestId)}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'coda.pages.getExportStatus',
		{ ...input },
		'completed',
	);
	return response;
};

export const Pages = {
	list,
	get,
	create,
	update,
	delete: deleteOne,
	listContent,
	deleteContent,
	beginExport,
	getExportStatus,
};
