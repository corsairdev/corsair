import { logEventFromContext } from 'corsair/core';
import type { SalesforceEndpoints } from '..';
import { makeSalesforceRequest } from '../client';

export const runSoqlQuery: SalesforceEndpoints['runSoqlQuery'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesforceRequest<{
		totalSize: number;
		done: boolean;
		records: Array<Record<string, unknown>>;
		nextRecordsUrl?: string;
	}>('query', ctx.key, { method: 'GET', query: { q: input.q } });

	await logEventFromContext(
		ctx,
		'salesforce.soql.run_query',
		input,
		'completed',
	);
	return response;
};

export const queryAll: SalesforceEndpoints['queryAll'] = async (ctx, input) => {
	const response = await makeSalesforceRequest<{
		totalSize: number;
		done: boolean;
		records: Array<Record<string, unknown>>;
	}>('queryAll', ctx.key, { method: 'GET', query: { q: input.q } });

	await logEventFromContext(
		ctx,
		'salesforce.soql.query_all',
		input,
		'completed',
	);
	return response;
};

export const search: SalesforceEndpoints['search'] = async (ctx, input) => {
	const response = await makeSalesforceRequest<{
		searchRecords: Array<Record<string, unknown>>;
	}>('search', ctx.key, { method: 'GET', query: { q: input.q } });

	await logEventFromContext(ctx, 'salesforce.sosl.search', input, 'completed');
	return { searchRecords: response.searchRecords ?? [] };
};

export const executeSoslSearch: SalesforceEndpoints['executeSoslSearch'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<{
			searchRecords: Array<Record<string, unknown>>;
		}>('search', ctx.key, { method: 'GET', query: { q: input.q } });

		await logEventFromContext(
			ctx,
			'salesforce.sosl.execute_search',
			input,
			'completed',
		);
		return { searchRecords: response.searchRecords ?? [] };
	};

export const toolingQuery: SalesforceEndpoints['toolingQuery'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesforceRequest<{
		totalSize: number;
		done: boolean;
		records: Array<Record<string, unknown>>;
	}>('tooling/query', ctx.key, { method: 'GET', query: { q: input.q } });

	await logEventFromContext(
		ctx,
		'salesforce.tooling.query',
		input,
		'completed',
	);
	return response;
};

export const parameterizedSearch: SalesforceEndpoints['parameterizedSearch'] =
	async (ctx, input) => {
		const isPost = Boolean(input.sobjects);
		const response = await makeSalesforceRequest<{
			searchRecords: Array<Record<string, unknown>>;
		}>('parameterizedSearch', ctx.key, {
			method: isPost ? 'POST' : 'GET',
			query: { q: input.q },
			body: isPost ? { q: input.q, sobjects: input.sobjects } : undefined,
		});

		await logEventFromContext(
			ctx,
			'salesforce.search.parameterized',
			input,
			'completed',
		);
		return { searchRecords: response.searchRecords ?? [] };
	};

export const postParameterizedSearch: SalesforceEndpoints['postParameterizedSearch'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<{
			searchRecords: Array<Record<string, unknown>>;
		}>('parameterizedSearch', ctx.key, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'salesforce.search.post_parameterized',
			input,
			'completed',
		);
		return { searchRecords: response.searchRecords ?? [] };
	};

export const getSearchLayout: SalesforceEndpoints['getSearchLayout'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesforceRequest<Array<Record<string, unknown>>>(
		'search/layout',
		ctx.key,
		{
			method: 'GET',
			query: { q: input.sobjects },
		},
	);

	await logEventFromContext(
		ctx,
		'salesforce.search.layout',
		input,
		'completed',
	);
	return response;
};

/** @deprecated */
export const query: SalesforceEndpoints['query'] = async (ctx, input) => {
	const response = await makeSalesforceRequest<{
		totalSize: number;
		records: Array<Record<string, unknown>>;
	}>('query', ctx.key, { method: 'GET', query: { q: input.q } });

	await logEventFromContext(
		ctx,
		'salesforce.soql.query_deprecated',
		input,
		'completed',
	);
	return response;
};

/** @deprecated */
export const executeSoqlQuery: SalesforceEndpoints['executeSoqlQuery'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesforceRequest<{
		totalSize: number;
		records: Array<Record<string, unknown>>;
	}>('query', ctx.key, { method: 'GET', query: { q: input.q } });

	await logEventFromContext(
		ctx,
		'salesforce.soql.execute_query_deprecated',
		input,
		'completed',
	);
	return response;
};
