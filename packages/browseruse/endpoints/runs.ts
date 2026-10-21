import { logEventFromContext } from 'corsair/core';
import type { BrowserUseContext, BrowserUseEndpoints } from '..';
import { requestBrowserUse } from '../client';
import type { BrowserUseRun } from '../schema';
import {
	RunsCancelOutputSchema,
	RunsCreateOutputSchema,
	RunsGetOutputSchema,
} from './types';

async function saveRun(ctx: BrowserUseContext, run: BrowserUseRun) {
	if (!ctx.db.runs) return;
	try {
		await ctx.db.runs.upsertByEntityId(run.id, run);
	} catch (error) {
		console.warn('Failed to save Browser Use run to database:', error);
	}
}

/** Starts an agent run and returns immediately; poll `runs.get` until terminal. */
export const runsCreate: BrowserUseEndpoints['runsCreate'] = async (
	ctx,
	input,
) => {
	const raw = await requestBrowserUse('/runs', ctx.key, {
		method: 'POST',
		body: input,
	});
	const run = RunsCreateOutputSchema.parse(raw);
	await saveRun(ctx, {
		id: run.id,
		status: run.status,
		model: run.model,
		sessionId: run.sessionId,
		workspaceId: run.workspaceId,
		task: input.task,
	});
	await logEventFromContext(ctx, 'browseruse.runs.create', {}, 'completed');
	return run;
};

export const runsGet: BrowserUseEndpoints['runsGet'] = async (ctx, input) => {
	const raw = await requestBrowserUse(
		`/runs/${encodeURIComponent(input.id)}`,
		ctx.key,
	);
	const run = RunsGetOutputSchema.parse(raw);
	await saveRun(ctx, run);
	await logEventFromContext(ctx, 'browseruse.runs.get', {}, 'completed');
	return run;
};

export const runsCancel: BrowserUseEndpoints['runsCancel'] = async (
	ctx,
	input,
) => {
	const raw = await requestBrowserUse(
		`/runs/${encodeURIComponent(input.id)}/cancel`,
		ctx.key,
		{ method: 'POST' },
	);
	const run = RunsCancelOutputSchema.parse(raw);
	await saveRun(ctx, run);
	await logEventFromContext(ctx, 'browseruse.runs.cancel', {}, 'completed');
	return run;
};
