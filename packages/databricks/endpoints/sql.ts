import { logEventFromContext } from 'corsair/core';
import type { DatabricksEndpoints } from '..';
import { makeDatabricksRequest } from '../client';
import { safeEncode } from '../utils';

export const cancelSqlStatementExecution: DatabricksEndpoints['cancelSqlStatementExecution'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ status: string }>(
			`sql/statements/${safeEncode(input.statement_id)}/cancel`,
			ctx,
			{ method: 'POST' },
		);

		await logEventFromContext(
			ctx,
			'databricks.sql.cancel_statement_execution',
			input,
			'completed',
		);
		return response;
	};

export const createLegacySqlAlert: DatabricksEndpoints['createLegacySqlAlert'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ id: string }>(
			'preview/sql/alerts',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.sql.create_legacy_alert',
			input,
			'completed',
		);
		return response;
	};

export const createLegacySqlQuery: DatabricksEndpoints['createLegacySqlQuery'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ id: string }>(
			'preview/sql/queries',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.sql.create_legacy_query',
			{ name: input.name, data_source_id: input.data_source_id },
			'completed',
		);
		return response;
	};

export const createLegacySqlQueryVisualization: DatabricksEndpoints['createLegacySqlQueryVisualization'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ id: string }>(
			'preview/sql/visualizations',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.sql.create_legacy_query_visualization',
			input,
			'completed',
		);
		return response;
	};

export const createSqlAlert: DatabricksEndpoints['createSqlAlert'] = async (
	ctx,
	input,
) => {
	const response = await makeDatabricksRequest<{ id: string }>(
		'sql/alerts',
		ctx,
		{ method: 'POST', body: input },
	);

	await logEventFromContext(
		ctx,
		'databricks.sql.create_alert',
		input,
		'completed',
	);
	return response;
};

export const createSqlQuery: DatabricksEndpoints['createSqlQuery'] = async (
	ctx,
	input,
) => {
	const response = await makeDatabricksRequest<{ id: string }>(
		'sql/queries',
		ctx,
		{ method: 'POST', body: input },
	);

	await logEventFromContext(
		ctx,
		'databricks.sql.create_query',
		{ name: input.name, warehouse_id: input.warehouse_id },
		'completed',
	);
	return response;
};

export const createSqlQueryVisualization: DatabricksEndpoints['createSqlQueryVisualization'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ id: string }>(
			'sql/visualizations',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.sql.create_query_visualization',
			input,
			'completed',
		);
		return response;
	};

export const deleteLegacySqlAlert: DatabricksEndpoints['deleteLegacySqlAlert'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`preview/sql/alerts/${safeEncode(input.id)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.sql.delete_legacy_alert',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteLegacySqlQuery: DatabricksEndpoints['deleteLegacySqlQuery'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`preview/sql/queries/${safeEncode(input.id)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.sql.delete_legacy_query',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteLegacySqlQueryVisualization: DatabricksEndpoints['deleteLegacySqlQueryVisualization'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`preview/sql/visualizations/${safeEncode(input.id)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.sql.delete_legacy_query_visualization',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteSqlAlert: DatabricksEndpoints['deleteSqlAlert'] = async (
	ctx,
	input,
) => {
	await makeDatabricksRequest<void>(`sql/alerts/${safeEncode(input.id)}`, ctx, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'databricks.sql.delete_alert',
		input,
		'completed',
	);
	return { success: true };
};

export const deleteSqlDashboard: DatabricksEndpoints['deleteSqlDashboard'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`sql/dashboards/${safeEncode(input.id)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.sql.delete_dashboard',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteSqlQuery: DatabricksEndpoints['deleteSqlQuery'] = async (
	ctx,
	input,
) => {
	await makeDatabricksRequest<void>(
		`sql/queries/${safeEncode(input.id)}`,
		ctx,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'databricks.sql.delete_query',
		input,
		'completed',
	);
	return { success: true };
};

export const deleteSqlWarehouse: DatabricksEndpoints['deleteSqlWarehouse'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`sql/warehouses/${safeEncode(input.id)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.sql.delete_warehouse',
			input,
			'completed',
		);
		return { success: true };
	};
