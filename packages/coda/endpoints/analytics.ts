import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import type { CodaEndpointOutputs } from './types';

const listDocs: CodaEndpoints['analyticsListDocs'] = async (ctx, input) => {
	const response = await makeCodaRequest<
		CodaEndpointOutputs['analyticsListDocs']
	>('analytics/docs', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'coda.analytics.listDocs',
		{ ...input },
		'completed',
	);
	return response;
};

const listPages: CodaEndpoints['analyticsListPages'] = async (ctx, input) => {
	const { docId, ...query } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['analyticsListPages']
	>(`analytics/docs/${encodeURIComponent(docId)}/pages`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(
		ctx,
		'coda.analytics.listPages',
		{ ...input },
		'completed',
	);
	return response;
};

const getDocsSummary: CodaEndpoints['analyticsGetDocsSummary'] = async (
	ctx,
	input,
) => {
	const response = await makeCodaRequest<
		CodaEndpointOutputs['analyticsGetDocsSummary']
	>('analytics/docs/summary', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'coda.analytics.getDocsSummary',
		{ ...input },
		'completed',
	);
	return response;
};

const listPacks: CodaEndpoints['analyticsListPacks'] = async (ctx, input) => {
	const response = await makeCodaRequest<
		CodaEndpointOutputs['analyticsListPacks']
	>('analytics/packs', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'coda.analytics.listPacks',
		{ ...input },
		'completed',
	);
	return response;
};

const getPacksSummary: CodaEndpoints['analyticsGetPacksSummary'] = async (
	ctx,
	input,
) => {
	const response = await makeCodaRequest<
		CodaEndpointOutputs['analyticsGetPacksSummary']
	>('analytics/packs/summary', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'coda.analytics.getPacksSummary',
		{ ...input },
		'completed',
	);
	return response;
};

const listPackFormulas: CodaEndpoints['analyticsListPackFormulas'] = async (
	ctx,
	input,
) => {
	const { packId, ...query } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['analyticsListPackFormulas']
	>(`analytics/packs/${encodeURIComponent(packId)}/formulas`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(
		ctx,
		'coda.analytics.listPackFormulas',
		{ ...input },
		'completed',
	);
	return response;
};

const getLastUpdated: CodaEndpoints['analyticsGetLastUpdated'] = async (
	ctx,
	input,
) => {
	const response = await makeCodaRequest<
		CodaEndpointOutputs['analyticsGetLastUpdated']
	>('analytics/updated', ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'coda.analytics.getLastUpdated',
		{ ...input },
		'completed',
	);
	return response;
};

export const Analytics = {
	listDocs,
	listPages,
	getDocsSummary,
	listPacks,
	getPacksSummary,
	listPackFormulas,
	getLastUpdated,
};
