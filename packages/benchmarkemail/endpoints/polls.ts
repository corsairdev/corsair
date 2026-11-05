/**
 * Benchmark Email polls endpoints (classic REST API v3.0).
 *
 * @see https://developer.benchmarkemail.com/ (Polls folders)
 */
import { logEventFromContext } from 'corsair/core';
import type { BenchmarkEmailEndpoints } from '..';
import { makeBenchmarkEmailRequest } from '../client';
import { compactQuery } from './shared';
import type { BenchmarkEmailEndpointOutputs } from './types';

export const copyPoll: BenchmarkEmailEndpoints['pollsCopyPoll'] = async (
	ctx,
	input,
) => {
	const response = await makeBenchmarkEmailRequest<
		BenchmarkEmailEndpointOutputs['pollsCopyPoll']
	>(`Poll/${encodeURIComponent(input.pollID)}/Copy`, ctx.key, {
		method: 'POST',
		body: input.data,
	});

	await logEventFromContext(
		ctx,
		'benchmarkemail.polls.copyPoll',
		{ ...input },
		'completed',
	);
	return response;
};

export const createPoll: BenchmarkEmailEndpoints['pollsCreatePoll'] = async (
	ctx,
	input,
) => {
	const response = await makeBenchmarkEmailRequest<
		BenchmarkEmailEndpointOutputs['pollsCreatePoll']
	>(`Poll/`, ctx.key, { method: 'POST', body: input.data });

	await logEventFromContext(
		ctx,
		'benchmarkemail.polls.createPoll',
		{ ...input },
		'completed',
	);
	return response;
};

export const deletePoll: BenchmarkEmailEndpoints['pollsDeletePoll'] = async (
	ctx,
	input,
) => {
	const response = await makeBenchmarkEmailRequest<
		BenchmarkEmailEndpointOutputs['pollsDeletePoll']
	>(`Poll/${encodeURIComponent(input.pollID)}`, ctx.key, { method: 'DELETE' });

	await logEventFromContext(
		ctx,
		'benchmarkemail.polls.deletePoll',
		{ ...input },
		'completed',
	);
	return response;
};

export const getPollDetails: BenchmarkEmailEndpoints['pollsGetPollDetails'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['pollsGetPollDetails']
		>(`Poll/${encodeURIComponent(input.pollID)}`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.polls.getPollDetails',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getPolls: BenchmarkEmailEndpoints['pollsGetPolls'] = async (
	ctx,
	input,
) => {
	const response = await makeBenchmarkEmailRequest<
		BenchmarkEmailEndpointOutputs['pollsGetPolls']
	>(`Poll/`, ctx.key, {
		method: 'GET',
		query: compactQuery({ page: input.page, pageSize: input.pageSize }),
	});

	await logEventFromContext(
		ctx,
		'benchmarkemail.polls.getPolls',
		{ ...input },
		'completed',
	);
	return response;
};

export const getPollPreview: BenchmarkEmailEndpoints['pollsGetPollPreview'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['pollsGetPollPreview']
		>(`Poll/${encodeURIComponent(input.pollID)}/Render`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.polls.getPollPreview',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getPollResponseReport: BenchmarkEmailEndpoints['pollsGetPollResponseReport'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['pollsGetPollResponseReport']
		>(`Poll/${encodeURIComponent(input.pollID)}/Response`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.polls.getPollResponseReport',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updatePoll: BenchmarkEmailEndpoints['pollsUpdatePoll'] = async (
	ctx,
	input,
) => {
	const response = await makeBenchmarkEmailRequest<
		BenchmarkEmailEndpointOutputs['pollsUpdatePoll']
	>(`Poll/${encodeURIComponent(input.pollID)}`, ctx.key, {
		method: 'PATCH',
		body: input.data,
	});

	await logEventFromContext(
		ctx,
		'benchmarkemail.polls.updatePoll',
		{ ...input },
		'completed',
	);
	return response;
};
