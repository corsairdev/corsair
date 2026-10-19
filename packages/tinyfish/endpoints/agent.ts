import type { TinyFishEndpoints } from '..';
import {
	makeTinyFishRawRequest,
	makeTinyFishRequest,
	TinyFishError,
} from '../client';
import { persistRun } from '../run-store';
import { callTinyFish } from './call';
import {
	TinyFishEndpointInputSchemas,
	TinyFishEndpointOutputSchemas,
} from './types';

export const run: TinyFishEndpoints['run'] = async (ctx, input) => {
	return callTinyFish(
		ctx,
		'tinyfish.agent.run',
		TinyFishEndpointInputSchemas.run,
		TinyFishEndpointOutputSchemas.run,
		input,
		(validated) =>
			makeTinyFishRequest('agent', '/v1/automation/run', ctx.key, {
				method: 'POST',
				body: validated,
			}),
		(validated, response) => ({
			runId: response.run_id,
			status: response.status,
			steps: response.num_of_steps,
			targetUrl: validated.url,
		}),
		(validated, response) =>
			persistRun(ctx, {
				run_id: response.run_id,
				status: response.status,
				goal: validated.goal,
				started_at: response.started_at,
				finished_at: response.finished_at,
				num_of_steps: response.num_of_steps,
				result: response.result,
				error: response.error,
			}),
	);
};

export const runAsync: TinyFishEndpoints['runAsync'] = async (ctx, input) => {
	return callTinyFish(
		ctx,
		'tinyfish.agent.runAsync',
		TinyFishEndpointInputSchemas.runAsync,
		TinyFishEndpointOutputSchemas.runAsync,
		input,
		(validated) =>
			makeTinyFishRequest('agent', '/v1/automation/run-async', ctx.key, {
				method: 'POST',
				body: validated,
			}),
		(validated, response) => ({
			runId: response.run_id,
			accepted: response.run_id !== null && response.error === null,
			targetUrl: validated.url,
		}),
		(validated, response) =>
			persistRun(ctx, {
				// The response only carries the ID; the run is queued, not started.
				run_id: response.run_id,
				status: 'PENDING',
				goal: validated.goal,
			}),
	);
};

export const runBatch: TinyFishEndpoints['runBatch'] = async (ctx, input) => {
	return callTinyFish(
		ctx,
		'tinyfish.agent.runBatch',
		TinyFishEndpointInputSchemas.runBatch,
		TinyFishEndpointOutputSchemas.runBatch,
		input,
		(validated) =>
			makeTinyFishRequest('agent', '/v1/automation/run-batch', ctx.key, {
				method: 'POST',
				body: validated,
			}),
		(validated, response) => ({
			requested: validated.runs.length,
			created: response.run_ids?.length ?? 0,
			failed: response.error !== null,
		}),
	);
};

export const listRuns: TinyFishEndpoints['listRuns'] = async (ctx, input) => {
	return callTinyFish(
		ctx,
		'tinyfish.agent.listRuns',
		TinyFishEndpointInputSchemas.listRuns,
		TinyFishEndpointOutputSchemas.listRuns,
		input,
		(validated) =>
			makeTinyFishRequest('agent', '/v1/runs', ctx.key, {
				method: 'GET',
				query: {
					status: validated.status,
					goal: validated.goal,
					created_after: validated.created_after,
					created_before: validated.created_before,
					sort_direction: validated.sort_direction,
					cursor: validated.cursor,
					limit: validated.limit,
				},
			}),
		(_validated, response) => ({
			count: response.data.length,
			total: response.pagination.total,
			hasMore: response.pagination.has_more,
		}),
	);
};

export const getRun: TinyFishEndpoints['getRun'] = async (ctx, input) => {
	return callTinyFish(
		ctx,
		'tinyfish.agent.getRun',
		TinyFishEndpointInputSchemas.getRun,
		TinyFishEndpointOutputSchemas.getRun,
		input,
		(validated) =>
			makeTinyFishRequest(
				'agent',
				`/v1/runs/${encodeURIComponent(validated.runId)}`,
				ctx.key,
				{
					method: 'GET',
					query: {
						screenshots: validated.screenshots,
						html: validated.html,
					},
				},
			),
		(_validated, response) => ({
			runId: response.run_id,
			status: response.status,
			steps: response.steps.length,
			profileAttached: response.profile_attached,
		}),
		(_validated, response) =>
			persistRun(ctx, {
				run_id: response.run_id,
				status: response.status,
				goal: response.goal,
				created_at: response.created_at,
				started_at: response.started_at,
				finished_at: response.finished_at,
				num_of_steps: response.num_of_steps,
				result: response.result,
				error: response.error,
				profile_id: response.profile_id,
			}),
	);
};

export const getRuns: TinyFishEndpoints['getRuns'] = async (ctx, input) => {
	return callTinyFish(
		ctx,
		'tinyfish.agent.getRuns',
		TinyFishEndpointInputSchemas.getRuns,
		TinyFishEndpointOutputSchemas.getRuns,
		input,
		(validated) =>
			makeTinyFishRequest('agent', '/v1/runs/batch', ctx.key, {
				method: 'POST',
				body: { run_ids: validated.run_ids },
			}),
		(validated, response) => ({
			requested: validated.run_ids.length,
			found: response.data.length,
			notFound: response.not_found?.length ?? 0,
		}),
	);
};

export const cancelRun: TinyFishEndpoints['cancelRun'] = async (ctx, input) => {
	return callTinyFish(
		ctx,
		'tinyfish.agent.cancelRun',
		TinyFishEndpointInputSchemas.cancelRun,
		TinyFishEndpointOutputSchemas.cancelRun,
		input,
		(validated) =>
			makeTinyFishRequest(
				'agent',
				`/v1/runs/${encodeURIComponent(validated.runId)}/cancel`,
				ctx.key,
				{ method: 'POST' },
			),
		(_validated, response) => ({
			runId: response.run_id,
			status: response.status,
			cancelledAt: response.cancelled_at,
		}),
	);
};

export const cancelRuns: TinyFishEndpoints['cancelRuns'] = async (
	ctx,
	input,
) => {
	return callTinyFish(
		ctx,
		'tinyfish.agent.cancelRuns',
		TinyFishEndpointInputSchemas.cancelRuns,
		TinyFishEndpointOutputSchemas.cancelRuns,
		input,
		(validated) =>
			makeTinyFishRequest('agent', '/v1/runs/batch/cancel', ctx.key, {
				method: 'POST',
				body: { run_ids: validated.run_ids },
			}),
		(validated, response) => ({
			requested: validated.run_ids.length,
			cancelled: response.results.filter(
				(result) => result.status === 'CANCELLED',
			).length,
			notFound: response.not_found?.length ?? 0,
		}),
	);
};

export const getStepScreenshot: TinyFishEndpoints['getStepScreenshot'] = async (
	ctx,
	input,
) => {
	return callTinyFish(
		ctx,
		'tinyfish.agent.getStepScreenshot',
		TinyFishEndpointInputSchemas.getStepScreenshot,
		TinyFishEndpointOutputSchemas.getStepScreenshot,
		input,
		async (validated) => {
			const { contentType, bytes } = await makeTinyFishRawRequest(
				'agent',
				`/v1/runs/${encodeURIComponent(validated.runId)}/steps/${encodeURIComponent(validated.stepId)}/screenshot`,
				ctx.key,
				'image/jpeg',
			);
			if (!contentType.startsWith('image/')) {
				throw new TinyFishError(
					`Step screenshot returned a non-image response (${contentType || 'no content type'})`,
					{ method: 'GET' },
				);
			}
			return {
				contentType,
				base64: bytes.toString('base64'),
				sizeBytes: bytes.byteLength,
			};
		},
		(validated, response) => ({
			runId: validated.runId,
			stepId: validated.stepId,
			contentType: response.contentType,
			sizeBytes: response.sizeBytes,
		}),
	);
};

export const getStepHtml: TinyFishEndpoints['getStepHtml'] = async (
	ctx,
	input,
) => {
	return callTinyFish(
		ctx,
		'tinyfish.agent.getStepHtml',
		TinyFishEndpointInputSchemas.getStepHtml,
		TinyFishEndpointOutputSchemas.getStepHtml,
		input,
		async (validated) => {
			const { contentType, bytes } = await makeTinyFishRawRequest(
				'agent',
				`/v1/runs/${encodeURIComponent(validated.runId)}/steps/${encodeURIComponent(validated.stepId)}/html`,
				ctx.key,
				'text/html',
			);
			if (!contentType.startsWith('text/html')) {
				throw new TinyFishError(
					`Step HTML returned a non-HTML response (${contentType || 'no content type'})`,
					{ method: 'GET' },
				);
			}
			return { contentType, html: bytes.toString('utf8') };
		},
		(validated) => ({
			runId: validated.runId,
			stepId: validated.stepId,
		}),
	);
};
