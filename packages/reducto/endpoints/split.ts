import type { ReductoEndpoints } from '../index';
import { callReducto } from './call';
import {
	AsyncJobIdResponseSchema,
	SplitAsyncInputSchema,
	SplitInputSchema,
	SplitResponseSchema,
} from './types';

export const split: ReductoEndpoints['split'] = async (ctx, input) => {
	return callReducto(
		ctx,
		'reducto.split.split',
		SplitInputSchema,
		SplitResponseSchema,
		input,
		(body) => ({ method: 'POST', url: '/split', body }),
		(body, response) => ({
			jobId: response.job_id,
			sections: body.split_description.length,
		}),
	);
};

export const splitAsync: ReductoEndpoints['splitAsync'] = async (
	ctx,
	input,
) => {
	return callReducto(
		ctx,
		'reducto.split.splitAsync',
		SplitAsyncInputSchema,
		AsyncJobIdResponseSchema,
		input,
		(body) => ({ method: 'POST', url: '/split_async', body }),
		(_body, response) => ({ jobId: response.job_id }),
	);
};
