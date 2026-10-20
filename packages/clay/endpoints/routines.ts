import { logEventFromContext } from 'corsair/core';
import type { ClayContext, ClayEndpoints } from '..';
import { makeClayRequest } from '../client';
import type { ClayRoutineRun } from '../schema';
import { ClayEndpointInputSchemas, ClayEndpointOutputSchemas } from './types';

async function saveRun(
	ctx: ClayContext,
	run: Omit<ClayRoutineRun, 'updatedAt'>,
) {
	if (!ctx.db.routineRuns) return;
	try {
		const existing = await ctx.db.routineRuns.findByEntityId(run.routineRunId);
		await ctx.db.routineRuns.upsertByEntityId(run.routineRunId, {
			...existing?.data,
			...run,
			routineId: run.routineId ?? existing?.data.routineId,
			updatedAt: new Date(),
		});
	} catch (error) {
		console.warn('Failed to save Clay routine run to database:', error);
	}
}

export const run: ClayEndpoints['routinesRun'] = async (ctx, input) => {
	const { routine_id, ...body } =
		ClayEndpointInputSchemas.routinesRun.parse(input);
	const result = ClayEndpointOutputSchemas.routinesRun.parse(
		await makeClayRequest('routines/{routine_id}/run', ctx.key, {
			method: 'POST',
			path: { routine_id },
			body,
		}),
	);

	await saveRun(ctx, {
		routineRunId: result.routine_run_id,
		routineId: routine_id,
		status: result.status,
		total: body.items.length,
		finished: 0,
	});
	await logEventFromContext(
		ctx,
		'clay.routines.run',
		{ routineId: routine_id, itemCount: body.items.length },
		'completed',
	);
	return result;
};

export const getResults: ClayEndpoints['routinesGetResults'] = async (
	ctx,
	input,
) => {
	const { routine_run_id, cursor, limit } =
		ClayEndpointInputSchemas.routinesGetResults.parse(input);
	// 202 while the run is in progress, 200 once it is terminal.
	const result = ClayEndpointOutputSchemas.routinesGetResults.parse(
		await makeClayRequest('routines/run/{routine_run_id}/results', ctx.key, {
			path: { routine_run_id },
			query: { cursor, limit },
		}),
	);

	await saveRun(ctx, {
		routineRunId: result.routine_run_id,
		status: result.status,
		total: result.total,
		finished: result.finished,
	});
	await logEventFromContext(
		ctx,
		'clay.routines.getResults',
		{ status: result.status, finished: result.finished, total: result.total },
		'completed',
	);
	return result;
};
