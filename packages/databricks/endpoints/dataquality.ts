import { logEventFromContext } from 'corsair/core';
import type { DatabricksEndpoints } from '..';
import { makeDatabricksRequest } from '../client';

export const createDataQualityMonitor: DatabricksEndpoints['createDataQualityMonitor'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ monitor_id?: string }>(
			'quality-monitors',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.dataquality.create_monitor',
			input,
			'completed',
		);
		return response;
	};

export const createQualityMonitorV2: DatabricksEndpoints['createQualityMonitorV2'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ monitor_id?: string }>(
			'quality-monitors-v2',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.dataquality.create_monitor_v2',
			input,
			'completed',
		);
		return response;
	};
