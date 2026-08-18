import { logEventFromContext } from 'corsair/core';
import type { SalesforceEndpoints } from '..';
import { salesforceCall } from './shared';

export const postCompositeSobjects: SalesforceEndpoints['postCompositeSobjects'] =
	async (ctx, input) => {
		const response = await salesforceCall<Array<Record<string, unknown>>>(
			ctx,
			'composite/sobjects',
			{
				method: 'POST',
				body: input,
			},
		);

		await logEventFromContext(
			ctx,
			'salesforce.composite.post_sobjects',
			input,
			'completed',
		);
		return response;
	};

export const createSobjectTree: SalesforceEndpoints['createSobjectTree'] =
	async (ctx, input) => {
		const response = await salesforceCall<{
			hasErrors: boolean;
			results: Array<Record<string, unknown>>;
		}>(ctx, `composite/tree/${input.sobject}`, {
			method: 'POST',
			body: { records: input.records },
		});

		await logEventFromContext(
			ctx,
			'salesforce.composite.tree',
			input,
			'completed',
		);
		return response;
	};

export const deleteSobjectCollections: SalesforceEndpoints['deleteSobjectCollections'] =
	async (ctx, input) => {
		const idsQuery = input.ids.join(',');
		const response = await salesforceCall<Array<Record<string, unknown>>>(
			ctx,
			'composite/sobjects',
			{
				method: 'DELETE',
				query: {
					ids: idsQuery,
					allOrNone: input.allOrNone ? 'true' : 'false',
				},
			},
		);

		await logEventFromContext(
			ctx,
			'salesforce.composite.delete_sobjects',
			input,
			'completed',
		);
		return response;
	};

export const postCompositeGraph: SalesforceEndpoints['postCompositeGraph'] =
	async (ctx, input) => {
		const response = await salesforceCall<{
			graphs: Array<Record<string, unknown>>;
		}>(ctx, 'composite/graph', {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'salesforce.composite.graph',
			input,
			'completed',
		);
		return response;
	};

/** @deprecated */
export const compositeGraphAction: SalesforceEndpoints['compositeGraphAction'] =
	async (ctx, input) => {
		const response = await salesforceCall<{
			graphs: Array<Record<string, unknown>>;
		}>(ctx, 'composite/graph', {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'salesforce.composite.graph_deprecated',
			input,
			'completed',
		);
		return response;
	};

export const getABatchOfRecords: SalesforceEndpoints['getABatchOfRecords'] =
	async (ctx, input) => {
		const response = await salesforceCall<{
			results: Array<Record<string, unknown>>;
		}>(ctx, 'composite/sobjects', {
			method: 'POST',
			body: {
				ids: input.ids,
				fields: input.fields,
			},
		});

		await logEventFromContext(
			ctx,
			'salesforce.composite.get_batch',
			input,
			'completed',
		);
		return response;
	};

export const getCompositeResources: SalesforceEndpoints['getCompositeResources'] =
	async (ctx, _input) => {
		const response = await salesforceCall<Record<string, unknown>>(
			ctx,
			'composite',
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.composite.resources',
			{},
			'completed',
		);
		return response;
	};

export const getCompositeSobjects: SalesforceEndpoints['getCompositeSobjects'] =
	async (ctx, input) => {
		const response = await salesforceCall<Array<Record<string, unknown>>>(
			ctx,
			'composite/sobjects',
			{
				method: 'POST',
				body: {
					ids: input.ids,
					fields: input.fields,
				},
			},
		);

		await logEventFromContext(
			ctx,
			'salesforce.composite.get_sobjects',
			input,
			'completed',
		);
		return response;
	};

export const getSobjectCollections: SalesforceEndpoints['getSobjectCollections'] =
	async (ctx, input) => {
		const response = await salesforceCall<Array<Record<string, unknown>>>(
			ctx,
			'composite/sobjects',
			{
				method: 'POST',
				body: {
					ids: input.ids,
					fields: input.fields,
				},
			},
		);

		await logEventFromContext(
			ctx,
			'salesforce.composite.get_sobject_collections',
			input,
			'completed',
		);
		return response;
	};

export const patchCompositeSobjects: SalesforceEndpoints['patchCompositeSobjects'] =
	async (ctx, input) => {
		const response = await salesforceCall<unknown>(ctx, 'composite/sobjects', {
			method: 'PATCH',
			body: {
				allOrNone: input.allOrNone,
				records: input.records,
			},
		});
		await logEventFromContext(
			ctx,
			'salesforce.composite.patch_sobjects',
			input,
			'completed',
		);
		return { result: response };
	};
