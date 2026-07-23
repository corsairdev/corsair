import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedGoogleBigqueryRequest } from '../client';
import type { GoogleBigqueryEndpoints } from '../index';
import type { GoogleBigqueryEndpointOutputs } from './types';

export const list: GoogleBigqueryEndpoints['tablesList'] = async (
	ctx,
	input,
) => {
	const { projectId, datasetId, ...query } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['tablesList']
	>(`/projects/${projectId}/datasets/${datasetId}/tables`, ctx, {
		method: 'GET',
		query,
	});

	if (result.tables && ctx.db.tables) {
		try {
			for (const table of result.tables) {
				if (table.id) {
					await ctx.db.tables.upsertByEntityId(table.id, {
						...table,
						id: table.id,
						createdAt: new Date(),
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save tables to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlebigquery.tables.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const listTableData: GoogleBigqueryEndpoints['tablesListTableData'] =
	async (ctx, input) => {
		const { projectId, datasetId, tableId, ...query } = input;
		const result = await makeAuthenticatedGoogleBigqueryRequest<
			GoogleBigqueryEndpointOutputs['tablesListTableData']
		>(
			`/projects/${projectId}/datasets/${datasetId}/tables/${tableId}/data`,
			ctx,
			{ method: 'GET', query },
		);

		await logEventFromContext(
			ctx,
			'googlebigquery.tables.listTableData',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getSchema: GoogleBigqueryEndpoints['tablesGetSchema'] = async (
	ctx,
	input,
) => {
	const { projectId, datasetId, tableId, ...query } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['tablesGetSchema']
	>(`/projects/${projectId}/datasets/${datasetId}/tables/${tableId}`, ctx, {
		method: 'GET',
		query,
	});

	if (result.id && ctx.db.tables) {
		try {
			await ctx.db.tables.upsertByEntityId(result.id, {
				...result,
				id: result.id,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save table to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlebigquery.tables.getSchema',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: GoogleBigqueryEndpoints['tablesCreate'] = async (
	ctx,
	input,
) => {
	const { projectId, datasetId, ...body } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['tablesCreate']
	>(`/projects/${projectId}/datasets/${datasetId}/tables`, ctx, {
		method: 'POST',
		body,
	});

	if (result.id && ctx.db.tables) {
		try {
			await ctx.db.tables.upsertByEntityId(result.id, {
				...result,
				id: result.id,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save table to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlebigquery.tables.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: GoogleBigqueryEndpoints['tablesUpdate'] = async (
	ctx,
	input,
) => {
	const { projectId, datasetId, tableId, table } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['tablesUpdate']
	>(`/projects/${projectId}/datasets/${datasetId}/tables/${tableId}`, ctx, {
		method: 'PUT',
		body: table,
	});

	if (result.id && ctx.db.tables) {
		try {
			await ctx.db.tables.upsertByEntityId(result.id, {
				...result,
				id: result.id,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save table to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlebigquery.tables.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const patch: GoogleBigqueryEndpoints['tablesPatch'] = async (
	ctx,
	input,
) => {
	const { projectId, datasetId, tableId, table } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['tablesPatch']
	>(`/projects/${projectId}/datasets/${datasetId}/tables/${tableId}`, ctx, {
		method: 'PATCH',
		body: table,
	});

	if (result.id && ctx.db.tables) {
		try {
			await ctx.db.tables.upsertByEntityId(result.id, {
				...result,
				id: result.id,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save table to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlebigquery.tables.patch',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteTable: GoogleBigqueryEndpoints['tablesDelete'] = async (
	ctx,
	input,
) => {
	const { projectId, datasetId, tableId } = input;
	await makeAuthenticatedGoogleBigqueryRequest<void>(
		`/projects/${projectId}/datasets/${datasetId}/tables/${tableId}`,
		ctx,
		{ method: 'DELETE' },
	);

	if (ctx.db.tables) {
		try {
			// Matches BigQuery table resource id used on upsert: "projectId:datasetId.tableId"
			await ctx.db.tables.deleteByEntityId(
				`${projectId}:${datasetId}.${tableId}`,
			);
		} catch (error) {
			console.warn('Failed to delete table from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlebigquery.tables.delete',
		{ ...input },
		'completed',
	);
};
