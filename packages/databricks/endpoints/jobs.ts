import { logEventFromContext } from 'corsair/core';
import type { DatabricksEndpoints } from '..';
import { makeDatabricksRequest } from '../client';

export const cancelAllJobRuns: DatabricksEndpoints['cancelAllJobRuns'] = async (
	ctx,
	input,
) => {
	await makeDatabricksRequest<void>('jobs/runs/cancel-all', ctx, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'databricks.jobs.cancel_all_runs',
		input,
		'completed',
	);
	return { success: true };
};

export const cancelJobRun: DatabricksEndpoints['cancelJobRun'] = async (
	ctx,
	input,
) => {
	await makeDatabricksRequest<void>('jobs/runs/cancel', ctx, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'databricks.jobs.cancel_run',
		input,
		'completed',
	);
	return { success: true };
};

export const deleteDatabricksJobRun: DatabricksEndpoints['deleteDatabricksJobRun'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>('jobs/runs/delete', ctx, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'databricks.jobs.delete_run',
			input,
			'completed',
		);
		return { success: true };
	};
