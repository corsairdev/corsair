import type { ReductoEndpoints } from '../index';
import { callReducto } from './call';
import {
	AsyncJobIdResponseSchema,
	EditAsyncInputSchema,
	EditInputSchema,
	EditResponseSchema,
} from './types';

export const edit: ReductoEndpoints['edit'] = async (ctx, input) => {
	return callReducto(
		ctx,
		'reducto.edit.edit',
		EditInputSchema,
		EditResponseSchema,
		input,
		(body) => ({ method: 'POST', url: '/edit', body }),
		(_body, response) => ({ jobId: response.job_id }),
	);
};

export const editAsync: ReductoEndpoints['editAsync'] = async (ctx, input) => {
	return callReducto(
		ctx,
		'reducto.edit.editAsync',
		EditAsyncInputSchema,
		AsyncJobIdResponseSchema,
		input,
		(body) => ({ method: 'POST', url: '/edit_async', body }),
		(_body, response) => ({ jobId: response.job_id }),
	);
};
