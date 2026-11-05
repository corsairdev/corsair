import type { ReductoEndpoints } from '../index';
import { callReducto } from './call';
import {
	AsyncJobIdResponseSchema,
	ExtractAsyncInputSchema,
	ExtractInputSchema,
	ExtractResponseSchema,
} from './types';

export const extract: ReductoEndpoints['extract'] = async (ctx, input) => {
	return callReducto(
		ctx,
		'reducto.extract.extract',
		ExtractInputSchema,
		ExtractResponseSchema,
		input,
		(body) => ({ method: 'POST', url: '/extract', body }),
		(_body, response) => ({
			jobId: response.job_id,
			pages: response.usage.num_pages,
		}),
	);
};

export const extractAsync: ReductoEndpoints['extractAsync'] = async (
	ctx,
	input,
) => {
	return callReducto(
		ctx,
		'reducto.extract.extractAsync',
		ExtractAsyncInputSchema,
		AsyncJobIdResponseSchema,
		input,
		(body) => ({ method: 'POST', url: '/extract_async', body }),
		(_body, response) => ({ jobId: response.job_id }),
	);
};
