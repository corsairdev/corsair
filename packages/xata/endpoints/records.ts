import { logEventFromContext } from 'corsair/core';
import { makeXataDataRequest } from '../client';
import type { XataEndpoints } from '../index';
import type {
	RecordsCreateResponse,
	RecordsDeleteResponse,
	RecordsGetResponse,
	RecordsQueryResponse,
	RecordsUpdateResponse,
} from './types';

function resolveDataParams(
	ctx: Parameters<XataEndpoints['recordsCreate']>[0],
	input: { workspaceId?: string; region?: string; branch?: string },
) {
	const workspaceId = input.workspaceId ?? ctx.options.workspaceId;
	const region = input.region ?? ctx.options.region;
	const branch = input.branch ?? ctx.options.defaultBranch ?? 'main';

	if (!workspaceId) {
		throw new Error(
			'[validation:xata:workspaceId]: workspaceId must be specified in plugin options or endpoint payload.',
		);
	}
	if (!region) {
		throw new Error(
			'[validation:xata:region]: region must be specified in plugin options or endpoint payload.',
		);
	}

	return { workspaceId, region, branch };
}

export const create: XataEndpoints['recordsCreate'] = async (ctx, input) => {
	const { workspaceId, region, branch } = resolveDataParams(ctx, input);

	const response = await makeXataDataRequest<RecordsCreateResponse>(
		`db/${input.dbName}:${branch}/tables/${input.tableName}/data`,
		ctx.key,
		workspaceId,
		region,
		{
			method: 'POST',
			body: input.data,
		},
	);

	const { data, ...safeInput } = input;
	await logEventFromContext(
		ctx,
		'xata.records.create',
		{ ...safeInput },
		'completed',
	);
	return response;
};

export const get: XataEndpoints['recordsGet'] = async (ctx, input) => {
	const { workspaceId, region, branch } = resolveDataParams(ctx, input);

	const response = await makeXataDataRequest<RecordsGetResponse>(
		`db/${input.dbName}:${branch}/tables/${input.tableName}/data/${input.recordId}`,
		ctx.key,
		workspaceId,
		region,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(ctx, 'xata.records.get', { ...input }, 'completed');
	return response;
};

export const update: XataEndpoints['recordsUpdate'] = async (ctx, input) => {
	const { workspaceId, region, branch } = resolveDataParams(ctx, input);

	const response = await makeXataDataRequest<RecordsUpdateResponse>(
		`db/${input.dbName}:${branch}/tables/${input.tableName}/data/${input.recordId}`,
		ctx.key,
		workspaceId,
		region,
		{
			method: 'PATCH',
			body: input.data,
		},
	);

	const { data, ...safeInput } = input;
	await logEventFromContext(
		ctx,
		'xata.records.update',
		{ ...safeInput },
		'completed',
	);
	return response;
};

export const deleteRecord: XataEndpoints['recordsDelete'] = async (
	ctx,
	input,
) => {
	const { workspaceId, region, branch } = resolveDataParams(ctx, input);

	const response = await makeXataDataRequest<RecordsDeleteResponse>(
		`db/${input.dbName}:${branch}/tables/${input.tableName}/data/${input.recordId}`,
		ctx.key,
		workspaceId,
		region,
		{
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'xata.records.delete',
		{ ...input },
		'completed',
	);
	return response ?? { id: input.recordId, success: true };
};

export const query: XataEndpoints['recordsQuery'] = async (ctx, input) => {
	const { workspaceId, region, branch } = resolveDataParams(ctx, input);

	const body: Record<string, unknown> = {};
	if (input.filter) body.filter = input.filter;
	if (input.sort) body.sort = input.sort;
	if (input.columns) body.columns = input.columns;
	if (input.page) body.page = input.page;

	const response = await makeXataDataRequest<RecordsQueryResponse>(
		`db/${input.dbName}:${branch}/tables/${input.tableName}/query`,
		ctx.key,
		workspaceId,
		region,
		{
			method: 'POST',
			body,
		},
	);

	const { filter, sort, columns, page, ...safeInput } = input;
	await logEventFromContext(
		ctx,
		'xata.records.query',
		{ ...safeInput },
		'completed',
	);
	return response;
};

export const Records = {
	create,
	get,
	update,
	deleteRecord,
	query,
} as const;
