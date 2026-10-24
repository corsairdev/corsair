import { logEventFromContext } from 'corsair/core';
import { requestBrowserUse } from '../client';
import type { BrowserUseSaveContext } from './save';
import { browserUseLogContext, saveRun } from './save';
import type { BrowserUseEndpointInputs } from './types';
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
export async function runsCreate(
	ctx: BrowserUseSaveContext,
	input: BrowserUseEndpointInputs['runsCreate'],
) {
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
	await logEventFromContext(
		browserUseLogContext(ctx),
		'browseruse.runs.create',
		{},
		'completed',
	);
	return run;
}

export async function runsGet(
	ctx: BrowserUseSaveContext,
	input: BrowserUseEndpointInputs['runsGet'],
) {
	const validated = RunsGetInputSchema.parse(input);
	const raw = await requestBrowserUse(
		`/runs/${encodeURIComponent(validated.id)}`,
		ctx.key,
	);
	const run = RunsGetOutputSchema.parse(raw);
	await saveRun(ctx, run);
	await logEventFromContext(
		browserUseLogContext(ctx),
		'browseruse.runs.get',
		{},
		'completed',
	);
	return run;
}

/** Cheap indexed lookup. The v4 docs say to poll this, not the full run. */
export async function runsGetStatus(
	ctx: BrowserUseSaveContext,
	input: BrowserUseEndpointInputs['runsGetStatus'],
) {
	const validated = RunsStatusInputSchema.parse(input);
	const raw = await requestBrowserUse(
		`/runs/${encodeURIComponent(validated.id)}/status`,
		ctx.key,
	);
	const status = RunsStatusOutputSchema.parse(raw);
	await saveRun(ctx, { id: validated.id, status: status.status });
	await logEventFromContext(
		browserUseLogContext(ctx),
		'browseruse.runs.getStatus',
		{},
		'completed',
	);
	return status;
}

export async function runsCancel(
	ctx: BrowserUseSaveContext,
	input: BrowserUseEndpointInputs['runsCancel'],
) {
	const validated = RunsCancelInputSchema.parse(input);
	const raw = await requestBrowserUse(
		`/runs/${encodeURIComponent(validated.id)}/cancel`,
		ctx.key,
		{ method: 'POST' },
	);
	const run = RunsCancelOutputSchema.parse(raw);
	await saveRun(ctx, run);
	await logEventFromContext(
		browserUseLogContext(ctx),
		'browseruse.runs.cancel',
		{},
		'completed',
	);
	return run;
}
