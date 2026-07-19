import { logEventFromContext } from 'corsair/core';
import { makeOpenaiRequest } from '../client';
import type { OpenaiEndpoints } from '../index';
import type {
	EvalRunsCancelResponse,
	EvalRunsCreateResponse,
	EvalRunsDeleteResponse,
	EvalRunsGetOutputItemResponse,
	EvalRunsGetResponse,
	EvalRunsListOutputItemsResponse,
	EvalRunsListResponse,
	EvalsCreateResponse,
	EvalsDeleteResponse,
	EvalsGetResponse,
	EvalsListResponse,
	EvalsUpdateResponse,
	GradersRunResponse,
	GradersValidateResponse,
} from '../schema/evals';

// --- Evals ---

export const create: OpenaiEndpoints['evalsCreate'] = async (ctx, input) => {
	const result = await makeOpenaiRequest<EvalsCreateResponse>(
		'evals',
		ctx.key,
		{
			method: 'POST',
			body: {
				name: input.name,
				data_source_config: input.dataSourceConfig,
				testing_criteria: input.testingCriteria,
				metadata: input.metadata,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.evals.create',
		{ name: input.name },
		'completed',
	);
	return result;
};

export const list: OpenaiEndpoints['evalsList'] = async (ctx, input) => {
	const result = await makeOpenaiRequest<EvalsListResponse>('evals', ctx.key, {
		method: 'GET',
		query: {
			after: input.after,
			limit: input.limit,
			order: input.order,
			order_by: input.orderBy,
		},
	});

	await logEventFromContext(
		ctx,
		'openai.evals.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: OpenaiEndpoints['evalsGet'] = async (ctx, input) => {
	const result = await makeOpenaiRequest<EvalsGetResponse>(
		`evals/${input.evalId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'openai.evals.get', { ...input }, 'completed');
	return result;
};

export const update: OpenaiEndpoints['evalsUpdate'] = async (ctx, input) => {
	const result = await makeOpenaiRequest<EvalsUpdateResponse>(
		`evals/${input.evalId}`,
		ctx.key,
		{ method: 'POST', body: { name: input.name, metadata: input.metadata } },
	);

	await logEventFromContext(
		ctx,
		'openai.evals.update',
		{ evalId: input.evalId },
		'completed',
	);
	return result;
};

export const deleteEval: OpenaiEndpoints['evalsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<EvalsDeleteResponse>(
		`evals/${input.evalId}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'openai.evals.delete',
		{ ...input },
		'completed',
	);
	return result;
};

// --- Eval Runs ---

export const createRun: OpenaiEndpoints['evalRunsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<EvalRunsCreateResponse>(
		`evals/${input.evalId}/runs`,
		ctx.key,
		{
			method: 'POST',
			body: {
				name: input.name,
				data_source: input.dataSource,
				metadata: input.metadata,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.evalRuns.create',
		{ evalId: input.evalId },
		'completed',
	);
	return result;
};

export const getRun: OpenaiEndpoints['evalRunsGet'] = async (ctx, input) => {
	const result = await makeOpenaiRequest<EvalRunsGetResponse>(
		`evals/${input.evalId}/runs/${input.runId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'openai.evalRuns.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const listRuns: OpenaiEndpoints['evalRunsList'] = async (ctx, input) => {
	const { evalId, ...query } = input;
	const result = await makeOpenaiRequest<EvalRunsListResponse>(
		`evals/${evalId}/runs`,
		ctx.key,
		{ method: 'GET', query: { ...query } },
	);

	await logEventFromContext(
		ctx,
		'openai.evalRuns.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const cancelRun: OpenaiEndpoints['evalRunsCancel'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<EvalRunsCancelResponse>(
		`evals/${input.evalId}/runs/${input.runId}/cancel`,
		ctx.key,
		{ method: 'POST' },
	);

	await logEventFromContext(
		ctx,
		'openai.evalRuns.cancel',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteRun: OpenaiEndpoints['evalRunsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<EvalRunsDeleteResponse>(
		`evals/${input.evalId}/runs/${input.runId}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'openai.evalRuns.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const getRunOutputItem: OpenaiEndpoints['evalRunsGetOutputItem'] =
	async (ctx, input) => {
		const result = await makeOpenaiRequest<EvalRunsGetOutputItemResponse>(
			`evals/${input.evalId}/runs/${input.runId}/output_items/${input.outputItemId}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'openai.evalRuns.getOutputItem',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listRunOutputItems: OpenaiEndpoints['evalRunsListOutputItems'] =
	async (ctx, input) => {
		const { evalId, runId, ...query } = input;
		const result = await makeOpenaiRequest<EvalRunsListOutputItemsResponse>(
			`evals/${evalId}/runs/${runId}/output_items`,
			ctx.key,
			{ method: 'GET', query: { ...query } },
		);

		await logEventFromContext(
			ctx,
			'openai.evalRuns.listOutputItems',
			{ ...input },
			'completed',
		);
		return result;
	};

// --- Graders ---

export const runGrader: OpenaiEndpoints['gradersRun'] = async (ctx, input) => {
	const result = await makeOpenaiRequest<GradersRunResponse>(
		'graders/run',
		ctx.key,
		{
			method: 'POST',
			body: {
				grader: input.grader,
				item: input.item,
				model_sample: input.modelSample,
			},
		},
	);

	await logEventFromContext(ctx, 'openai.graders.run', {}, 'completed');
	return result;
};

export const validateGrader: OpenaiEndpoints['gradersValidate'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<GradersValidateResponse>(
		'graders/validate',
		ctx.key,
		{ method: 'POST', body: { grader: input.grader } },
	);

	await logEventFromContext(ctx, 'openai.graders.validate', {}, 'completed');
	return result;
};
