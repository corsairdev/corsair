import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import type { CodaEndpointOutputs } from './types';

const list: CodaEndpoints['domainsList'] = async (ctx, input) => {
	const { docId } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['domainsList']>(
		`docs/${encodeURIComponent(docId)}/domains`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'coda.domains.list',
		{ ...input },
		'completed',
	);
	return response;
};

const add: CodaEndpoints['domainsAdd'] = async (ctx, input) => {
	const { docId, ...body } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['domainsAdd']>(
		`docs/${encodeURIComponent(docId)}/domains`,
		ctx.key,
		{ method: 'POST', body },
	);
	await logEventFromContext(ctx, 'coda.domains.add', { ...input }, 'completed');
	return response;
};

const update: CodaEndpoints['domainsUpdate'] = async (ctx, input) => {
	const { docId, customDocDomain, body } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['domainsUpdate']>(
		`docs/${encodeURIComponent(docId)}/domains/${encodeURIComponent(customDocDomain)}`,
		ctx.key,
		{ method: 'PATCH', body },
	);
	await logEventFromContext(
		ctx,
		'coda.domains.update',
		{ ...input },
		'completed',
	);
	return response;
};

const deleteOne: CodaEndpoints['domainsDelete'] = async (ctx, input) => {
	const { docId, customDocDomain } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['domainsDelete']>(
		`docs/${encodeURIComponent(docId)}/domains/${encodeURIComponent(customDocDomain)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'coda.domains.delete',
		{ ...input },
		'completed',
	);
	return response;
};

const getProvider: CodaEndpoints['domainsGetProvider'] = async (ctx, input) => {
	const { customDocDomain } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['domainsGetProvider']
	>(`domains/provider/${encodeURIComponent(customDocDomain)}`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'coda.domains.getProvider',
		{ ...input },
		'completed',
	);
	return response;
};

export const Domains = {
	list,
	add,
	update,
	delete: deleteOne,
	getProvider,
};
