import type { TemplatedEndpoints } from '..';
import { call, callDelete } from './call';
import {
	RendersCreateInputSchema,
	RendersCreateResponseSchema,
	RendersDuplicateInputSchema,
	RendersGetInputSchema,
	RendersGetResponseSchema,
	RendersListInputSchema,
	RendersListResponseSchema,
	RendersMergeInputSchema,
	RendersMergeResponseSchema,
	RendersRemoveInputSchema,
} from './types';

export const rendersList: TemplatedEndpoints['rendersList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'renders.list',
			input: RendersListInputSchema,
			output: RendersListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/renders',
		}),
	);
};

export const rendersGet: TemplatedEndpoints['rendersGet'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'renders.get',
			input: RendersGetInputSchema,
			output: RendersGetResponseSchema,
		},
		input,
		(parsed) => ({ method: 'GET', path: `/render/${parsed.renderId}` }),
	);
};

export const rendersCreate: TemplatedEndpoints['rendersCreate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'renders.create',
			input: RendersCreateInputSchema,
			output: RendersCreateResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/render',
			body: parsed,
		}),
	);
};

export const rendersDuplicate: TemplatedEndpoints['rendersDuplicate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'renders.duplicate',
			input: RendersDuplicateInputSchema,
			output: RendersCreateResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `/render/${parsed.renderId}/duplicate`,
		}),
	);
};

export const rendersRemove: TemplatedEndpoints['rendersRemove'] = async (
	ctx,
	input,
) => {
	return callDelete(
		ctx,
		{ event: 'renders.remove', input: RendersRemoveInputSchema },
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/render/${parsed.renderId}`,
		}),
	);
};

export const rendersMerge: TemplatedEndpoints['rendersMerge'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'renders.merge',
			input: RendersMergeInputSchema,
			output: RendersMergeResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/render/merge',
			// Without host: true the route answers the file itself, which this
			// plugin does not model, so the merged PDF is always hosted.
			body: { ...parsed, host: true },
		}),
	);
};
