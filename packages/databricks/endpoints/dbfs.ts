import { logEventFromContext } from 'corsair/core';
import type { DatabricksEndpoints } from '..';
import { makeDatabricksRequest } from '../client';

export const addBlockToDbfsStream: DatabricksEndpoints['addBlockToDbfsStream'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>('dbfs/add-block', ctx, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'databricks.dbfs.add_block',
			input,
			'completed',
		);
		return { success: true };
	};

export const createDbfsFileStream: DatabricksEndpoints['createDbfsFileStream'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ handle: number }>(
			'dbfs/create',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.dbfs.create_stream',
			input,
			'completed',
		);
		return response;
	};

export const deleteDbfsFileOrDirectory: DatabricksEndpoints['deleteDbfsFileOrDirectory'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>('dbfs/delete', ctx, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'databricks.dbfs.delete',
			input,
			'completed',
		);
		return { success: true };
	};
