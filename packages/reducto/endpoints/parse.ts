import type { ReductoEndpoints } from '../index';
import { callReducto } from './call';
import {
	AsyncJobIdResponseSchema,
	ParseAsyncInputSchema,
	ParseInputSchema,
	ParseResponseSchema,
} from './types';

function asBody(value: object): Record<string, unknown> {
	return value as Record<string, unknown>;
}

export const parse: ReductoEndpoints['parse'] = async (ctx, input) => {
	return callReducto(
		ctx,
		'reducto.parse.parse',
		ParseInputSchema,
		ParseResponseSchema,
		input,
		(body) => ({ method: 'POST', url: '/parse', body: asBody(body) }),
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
		(body) => ({ method: 'POST', url: '/parse_async', body: asBody(body) }),
		(_body, response) => ({ jobId: response.job_id }),
	);
};
