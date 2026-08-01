import { logEventFromContext } from 'corsair/core';
import type { DatabricksEndpoints } from '..';
import { makeDatabricksRequest } from '../client';
import { safeEncode } from '../utils';

export const createDatabricksApp: DatabricksEndpoints['createDatabricksApp'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ name: string }>(
			'apps',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.apps.create_app',
			input,
			'completed',
		);
		return response;
	};

export const deleteDatabricksApp: DatabricksEndpoints['deleteDatabricksApp'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(`apps/${safeEncode(input.name)}`, ctx, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'databricks.apps.delete_app',
			input,
			'completed',
		);
		return { success: true };
	};

export const deployDatabricksApp: DatabricksEndpoints['deployDatabricksApp'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ deployment_id?: string }>(
			`apps/${safeEncode(input.name)}/deployments`,
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.apps.deploy_app',
			input,
			'completed',
		);
		return response;
	};
