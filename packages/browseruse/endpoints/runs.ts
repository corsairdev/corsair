import { logEventFromContext } from 'corsair/core';
import type { BrowserUseEndpoints } from '..';
import { requestBrowserUse } from '../client';
import { saveRun } from './save';
import {
	RunsCancelInputSchema,
	RunsCancelOutputSchema,
	RunsCreateInputSchema,
	RunsCreateOutputSchema,
	RunsGetInputSchema,
	RunsGetOutputSchema,
	RunsStatusInputSchema,
	RunsStatusOutputSchema,
} from './types';

/** Starts an agent run and returns immediately. Poll `runs.getStatus` until terminal, then `runs.get`. */
export const runsCreate: BrowserUseEndpoints['runsCreate'] = async (
	ctx,
	input,
) => {
	const body = RunsCreateInputSchema.parse(input);
	const raw = await requestBrowserUse('/runs', ctx.key, {
		method: 'POST',
		body,
	});
	const run = RunsCreateOutputSchema.parse(raw);
	await saveRun(ctx, {
		id: run.id,
		status: run.status,
		model: run.model,
		sessionId: run.sessionId,
		workspaceId: run.workspaceId,
		task: body.task,
	});
	await logEventFromContext(ctx, 'browseruse.runs.create', {}, 'completed');
	return run;
};

export const runsGet: BrowserUseEndpoints['runsGet'] = async (ctx, input) => {
	const validated = RunsGetInputSchema.parse(input);
	const raw = await requestBrowserUse(
		`/runs/${encodeURIComponent(validated.id)}`,
		ctx.key,
	);
	const run = RunsGetOutputSchema.parse(raw);
	await saveRun(ctx, run);
	await logEventFromContext(ctx, 'browseruse.runs.get', {}, 'completed');
	return run;
};

/** Cheap indexed lookup. The v4 docs say to poll this, not the full run. */
export const runsGetStatus: BrowserUseEndpoints['runsGetStatus'] = async (
	ctx,
	input,
) => {
	const validated = RunsStatusInputSchema.parse(input);
	const raw = await requestBrowserUse(
		`/runs/${encodeURIComponent(validated.id)}/status`,
		ctx.key,
	);
	const status = RunsStatusOutputSchema.parse(raw);
	await saveRun(ctx, { id: validated.id, status: status.status });
	await logEventFromContext(ctx, 'browseruse.runs.getStatus', {}, 'completed');
	return status;
};

export const runsCancel: BrowserUseEndpoints['runsCancel'] = async (
	ctx,
	input,
) => {
	const validated = RunsCancelInputSchema.parse(input);
	const raw = await requestBrowserUse(
		`/runs/${encodeURIComponent(validated.id)}/cancel`,
		ctx.key,
		{ method: 'POST' },
	);
	const run = RunsCancelOutputSchema.parse(raw);
	await saveRun(ctx, run);
	await logEventFromContext(ctx, 'browseruse.runs.cancel', {}, 'completed');
	return run;
};
