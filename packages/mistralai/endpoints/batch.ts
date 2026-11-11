import type { MistralAiEndpoints } from '../index';
import { callMistralAi } from './shared';
import {
	MistralAiEndpointInputSchemas,
	MistralAiEndpointOutputSchemas,
} from './types';

export const list: MistralAiEndpoints['batchList'] = async (ctx, rawInput) => {
	const input = MistralAiEndpointInputSchemas.batchList.parse(rawInput ?? {});
	return callMistralAi(ctx, '/v1/batch/jobs', {
		query: input,
		output: MistralAiEndpointOutputSchemas.batchList,
		event: 'batch.list',
		logged: { page: input.page },
	});
};

export const create: MistralAiEndpoints['batchCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.batchCreate.parse(rawInput);
	return callMistralAi(ctx, '/v1/batch/jobs', {
		method: 'POST',
		body: input,
		output: MistralAiEndpointOutputSchemas.batchCreate,
		event: 'batch.create',
		logged: {
			endpoint: input.endpoint,
			model: input.model,
			agent_id: input.agent_id,
		},
	});
};

export const get: MistralAiEndpoints['batchGet'] = async (ctx, rawInput) => {
	const input = MistralAiEndpointInputSchemas.batchGet.parse(rawInput);
	return callMistralAi(ctx, '/v1/batch/jobs/{job_id}', {
		path: { job_id: input.job_id },
		query: { inline: input.inline },
		output: MistralAiEndpointOutputSchemas.batchGet,
		event: 'batch.get',
		logged: { job_id: input.job_id },
	});
};

export const remove: MistralAiEndpoints['batchDelete'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.batchDelete.parse(rawInput);
	return callMistralAi(ctx, '/v1/batch/jobs/{job_id}', {
		method: 'DELETE',
		path: { job_id: input.job_id },
		output: MistralAiEndpointOutputSchemas.batchDelete,
		event: 'batch.delete',
		logged: { job_id: input.job_id },
	});
};

export const cancel: MistralAiEndpoints['batchCancel'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.batchCancel.parse(rawInput);
	return callMistralAi(ctx, '/v1/batch/jobs/{job_id}/cancel', {
		method: 'POST',
		path: { job_id: input.job_id },
		output: MistralAiEndpointOutputSchemas.batchCancel,
		event: 'batch.cancel',
		logged: { job_id: input.job_id },
	});
};
