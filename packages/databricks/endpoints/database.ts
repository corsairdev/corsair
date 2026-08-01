import { logEventFromContext } from 'corsair/core';
import type { DatabricksEndpoints } from '..';
import { makeDatabricksRequest } from '../client';
import { safeEncode } from '../utils';

export const createDatabaseInstance: DatabricksEndpoints['createDatabaseInstance'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{
			name: string;
			status?: string;
		}>('database/instances', ctx, { method: 'POST', body: input });

		await logEventFromContext(
			ctx,
			'databricks.database.create_instance',
			input,
			'completed',
		);
		return response;
	};

export const deleteDatabaseInstance: DatabricksEndpoints['deleteDatabaseInstance'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`database/instances/${safeEncode(input.name)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.database.delete_instance',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteSyncedDatabaseTable: DatabricksEndpoints['deleteSyncedDatabaseTable'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`database/synced-tables/${safeEncode(input.name)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.database.delete_synced_table',
			input,
			'completed',
		);
		return { success: true };
	};
