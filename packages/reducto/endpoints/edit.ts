import type { ReductoEndpoints } from '../index';
import { callReducto } from './call';
import {
	AsyncJobIdResponseSchema,
	EditAsyncInputSchema,
	EditInputSchema,
	EditResponseSchema,
} from './types';

function asBody(value: object): Record<string, unknown> {
	return value as Record<string, unknown>;
}

export const edit: ReductoEndpoints['edit'] = async (ctx, input) => {
	return callReducto(
		ctx,
		'reducto.edit.edit',
		EditInputSchema,
		EditResponseSchema,
		input,
		(body) => ({ method: 'POST', url: '/edit', body: asBody(body) }),
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
		(body) => ({ method: 'POST', url: '/edit_async', body: asBody(body) }),
		(_body, response) => ({ jobId: response.job_id }),
	);
};
