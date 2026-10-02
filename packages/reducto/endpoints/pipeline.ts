import type { ReductoEndpoints } from '../index';
import { callReducto } from './call';
import {
	AsyncJobIdResponseSchema,
	PipelineAsyncInputSchema,
	PipelineInputSchema,
	PipelineResponseSchema,
} from './types';

export const run: ReductoEndpoints['pipeline'] = async (ctx, input) => {
	return callReducto(
		ctx,
		'reducto.pipeline.run',
		PipelineInputSchema,
		PipelineResponseSchema,
		input,
		(body) => ({ method: 'POST', url: '/pipeline', body }),
		(body, response) => ({
			jobId: response.job_id,
			pipelineId: body.pipeline_id,
		}),
	);
};

export const runAsync: ReductoEndpoints['pipelineAsync'] = async (
	ctx,
	input,
) => {
	return callReducto(
		ctx,
		'reducto.pipeline.runAsync',
		PipelineAsyncInputSchema,
		AsyncJobIdResponseSchema,
		input,
		(body) => ({ method: 'POST', url: '/pipeline_async', body }),
		(body, response) => ({
			jobId: response.job_id,
			pipelineId: body.pipeline_id,
		}),
	);
};
