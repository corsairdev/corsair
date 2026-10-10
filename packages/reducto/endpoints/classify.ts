import type { ReductoEndpoints } from '../index';
import { callReducto } from './call';
import {
	AsyncJobIdResponseSchema,
	ClassifyAsyncInputSchema,
	ClassifyInputSchema,
	ClassifyResponseSchema,
} from './types';

export const classify: ReductoEndpoints['classify'] = async (ctx, input) => {
	return callReducto(
		ctx,
		'reducto.classify.classify',
		ClassifyInputSchema,
		ClassifyResponseSchema,
		input,
		(body) => ({ method: 'POST', url: '/classify', body }),
		(body, response) => ({
			jobId: response.job_id,
			categories: body.classification_schema?.length ?? 0,
		}),
	);
};

export const classifyAsync: ReductoEndpoints['classifyAsync'] = async (
	ctx,
	input,
) => {
	return callReducto(
		ctx,
		'reducto.classify.classifyAsync',
		ClassifyAsyncInputSchema,
		AsyncJobIdResponseSchema,
		input,
		(body) => ({
			method: 'POST',
			url: '/classify_async',
			body,
		}),
		(_body, response) => ({ jobId: response.job_id }),
	);
};
