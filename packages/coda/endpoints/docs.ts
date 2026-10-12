import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import { saveDocs } from './persist';
import type { CodaEndpointOutputs } from './types';

const list: CodaEndpoints['docsList'] = async (ctx, input) => {
	const response = await makeCodaRequest<CodaEndpointOutputs['docsList']>(
		'docs',
		ctx.key,
		{ method: 'GET', query: input },
	);
	await saveDocs(ctx, response.items);
	await logEventFromContext(ctx, 'coda.docs.list', { ...input }, 'completed');
	return response;
};

const get: CodaEndpoints['docsGet'] = async (ctx, input) => {
	const { docId } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['docsGet']>(
		`docs/${encodeURIComponent(docId)}`,
		ctx.key,
		{ method: 'GET' },
	);
	await saveDocs(ctx, [response]);
	await logEventFromContext(ctx, 'coda.docs.get', { ...input }, 'completed');
	return response;
};

const create: CodaEndpoints['docsCreate'] = async (ctx, input) => {
	const response = await makeCodaRequest<CodaEndpointOutputs['docsCreate']>(
		'docs',
		ctx.key,
		{ method: 'POST', body: input },
	);
	await logEventFromContext(ctx, 'coda.docs.create', { ...input }, 'completed');
	return response;
};

const copy: CodaEndpoints['docsCopy'] = async (ctx, input) => {
	const response = await makeCodaRequest<CodaEndpointOutputs['docsCopy']>(
		'docs',
		ctx.key,
		{ method: 'POST', body: input },
	);
	await logEventFromContext(ctx, 'coda.docs.copy', { ...input }, 'completed');
	return response;
};

const update: CodaEndpoints['docsUpdate'] = async (ctx, input) => {
	const { docId, ...body } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['docsUpdate']>(
		`docs/${encodeURIComponent(docId)}`,
		ctx.key,
		{ method: 'PATCH', body },
	);
	await logEventFromContext(ctx, 'coda.docs.update', { ...input }, 'completed');
	return response;
};

const deleteOne: CodaEndpoints['docsDelete'] = async (ctx, input) => {
	const { docId } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['docsDelete']>(
		`docs/${encodeURIComponent(docId)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	await logEventFromContext(ctx, 'coda.docs.delete', { ...input }, 'completed');
	return response;
};

const publish: CodaEndpoints['docsPublish'] = async (ctx, input) => {
	const { docId, ...body } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['docsPublish']>(
		`docs/${encodeURIComponent(docId)}/publish`,
		ctx.key,
		{ method: 'PUT', body },
	);
	await logEventFromContext(
		ctx,
		'coda.docs.publish',
		{ ...input },
		'completed',
	);
	return response;
};

const unpublish: CodaEndpoints['docsUnpublish'] = async (ctx, input) => {
	const { docId } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['docsUnpublish']>(
		`docs/${encodeURIComponent(docId)}/publish`,
		ctx.key,
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'coda.docs.unpublish',
		{ ...input },
		'completed',
	);
	return response;
};

export const Docs = {
	list,
	get,
	create,
	copy,
	update,
	delete: deleteOne,
	publish,
	unpublish,
};
