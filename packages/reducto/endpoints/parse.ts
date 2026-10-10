import type { ReductoEndpoints } from '../index';
import { callReducto } from './call';
import {
	AsyncJobIdResponseSchema,
	ParseAsyncInputSchema,
	ParseInputSchema,
	ParseResponseSchema,
} from './types';

export const parse: ReductoEndpoints['parse'] = async (ctx, input) => {
	return callReducto(
		ctx,
		'reducto.parse.parse',
		ParseInputSchema,
		ParseResponseSchema,
		input,
		(body) => ({ method: 'POST', url: '/parse', body }),
		(_body, response) => ({
			jobId: response.job_id,
			pages: response.usage.num_pages,
		}),
	);
};

export const parseAsync: ReductoEndpoints['parseAsync'] = async (
	ctx,
	input,
) => {
	return callReducto(
		ctx,
		'reducto.parse.parseAsync',
		ParseAsyncInputSchema,
		AsyncJobIdResponseSchema,
		input,
		(body) => ({ method: 'POST', url: '/parse_async', body }),
		(_body, response) => ({ jobId: response.job_id }),
	);
};
