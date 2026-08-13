import { logEventFromContext } from 'corsair/core';
import type { SalesforceEndpoints } from '..';
import { salesforceCall } from './shared';

export const runSoqlQuery: SalesforceEndpoints['runSoqlQuery'] = async (
	ctx,
	input,
) => {
	const response = await salesforceCall<{
		totalSize: number;
		done: boolean;
		records: Array<Record<string, unknown>>;
		nextRecordsUrl?: string;
	}>(ctx, 'query', { method: 'GET', query: { q: input.q } });

	await logEventFromContext(
		ctx,
		'salesforce.soql.run_query',
		input,
		'completed',
	);
	return response;
};

export const queryAll: SalesforceEndpoints['queryAll'] = async (ctx, input) => {
	const response = await salesforceCall<{
		totalSize: number;
		done: boolean;
		records: Array<Record<string, unknown>>;
	}>(ctx, 'queryAll', { method: 'GET', query: { q: input.q } });

	await logEventFromContext(
		ctx,
		'salesforce.soql.query_all',
		input,
		'completed',
	);
	return response;
};

export const search: SalesforceEndpoints['search'] = async (ctx, input) => {
	const response = await salesforceCall<{
		searchRecords: Array<Record<string, unknown>>;
	}>(ctx, 'search', { method: 'GET', query: { q: input.q } });

	await logEventFromContext(ctx, 'salesforce.sosl.search', input, 'completed');
	return { searchRecords: response.searchRecords ?? [] };
};

export const executeSoslSearch: SalesforceEndpoints['executeSoslSearch'] =
	async (ctx, input) => {
		const response = await salesforceCall<{
			searchRecords: Array<Record<string, unknown>>;
		}>(ctx, 'search', { method: 'GET', query: { q: input.q } });

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
	const response = await salesforceCall<{
		totalSize: number;
		done: boolean;
		records: Array<Record<string, unknown>>;
	}>(ctx, 'tooling/query', { method: 'GET', query: { q: input.q } });

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
		const response = await salesforceCall<{
			searchRecords: Array<Record<string, unknown>>;
		}>(ctx, 'parameterizedSearch', {
			method: isPost ? 'POST' : 'GET',
			query: isPost ? undefined : { q: input.q },
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
		const response = await salesforceCall<{
			searchRecords: Array<Record<string, unknown>>;
		}>(ctx, 'parameterizedSearch', {
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
	const response = await salesforceCall<Array<Record<string, unknown>>>(
		ctx,
		'search/layout',
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
	const response = await salesforceCall<{
		totalSize: number;
		records: Array<Record<string, unknown>>;
	}>(ctx, 'query', { method: 'GET', query: { q: input.q } });

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
	const response = await salesforceCall<{
		totalSize: number;
		records: Array<Record<string, unknown>>;
	}>(ctx, 'query', { method: 'GET', query: { q: input.q } });

	await logEventFromContext(
		ctx,
		'salesforce.soql.execute_query_deprecated',
		input,
		'completed',
	);
	return response;
};

export const getSearchSuggestions: SalesforceEndpoints['getSearchSuggestions'] =
	async (ctx, input) => {
		const response = await salesforceCall<unknown>(
			ctx,
			'search/suggestTitleMatches',
			{
				method: 'GET',
				query: { q: input.q, sobject: input.sobject },
			},
		);
		await logEventFromContext(
			ctx,
			'salesforce.search.suggestions',
			input,
			'completed',
		);
		return { result: response };
	};

export const searchKnowledgeArticles: SalesforceEndpoints['searchKnowledgeArticles'] =
	async (ctx, input) => {
		const response = await salesforceCall<unknown>(
			ctx,
			'search/suggestTitleMatches',
			{
				method: 'GET',
				query: { q: input.q, sobject: 'KnowledgeArticleVersion' },
			},
		);
		await logEventFromContext(
			ctx,
			'salesforce.search.knowledge',
			input,
			'completed',
		);
		return { result: response };
	};

export const getParameterizedSearch: SalesforceEndpoints['getParameterizedSearch'] =
	parameterizedSearch as unknown as SalesforceEndpoints['getParameterizedSearch'];
