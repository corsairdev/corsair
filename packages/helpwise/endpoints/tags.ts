import { logEventFromContext } from 'corsair/core';
import type { HelpwiseEndpoint } from '..';
import { makeHelpwiseRequest } from '../client';
import type {
	TagsActionResponse,
	TagsGetResponse,
	TagsListResponse,
} from './types';
import {
	HelpwiseEndpointInputSchemas,
	HelpwiseEndpointOutputSchemas,
} from './types';

export const list: HelpwiseEndpoint<'tags.list'> = async (ctx, input) => {
	HelpwiseEndpointInputSchemas['tags.list'].parse(input);
	const response = await makeHelpwiseRequest<TagsListResponse>(
		'/tags',
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed = HelpwiseEndpointOutputSchemas['tags.list'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.tags.list',
		{ count: parsed?.length ?? 0 },
		'completed',
	);
	return parsed;
};

export const get: HelpwiseEndpoint<'tags.get'> = async (ctx, input) => {
	const parsedInput = HelpwiseEndpointInputSchemas['tags.get'].parse(input);
	const response = await makeHelpwiseRequest<TagsGetResponse>(
		`/tags/${encodeURIComponent(parsedInput.tagId)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed = HelpwiseEndpointOutputSchemas['tags.get'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.tags.get',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

export const apply: HelpwiseEndpoint<'tags.apply'> = async (ctx, input) => {
	const parsedInput = HelpwiseEndpointInputSchemas['tags.apply'].parse(input);
	const response = await makeHelpwiseRequest<TagsActionResponse>(
		'/tags/apply',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);
	const parsed = HelpwiseEndpointOutputSchemas['tags.apply'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.tags.apply',
		{
			threadCount: parsedInput.threadIds.length,
			tagCount: parsedInput.tagIds.length,
		},
		'completed',
	);
	return parsed;
};

export const remove: HelpwiseEndpoint<'tags.remove'> = async (ctx, input) => {
	const parsedInput = HelpwiseEndpointInputSchemas['tags.remove'].parse(input);
	const response = await makeHelpwiseRequest<TagsActionResponse>(
		'/tags/remove',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);
	const parsed = HelpwiseEndpointOutputSchemas['tags.remove'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.tags.remove',
		{
			threadCount: parsedInput.threadIds.length,
			tagCount: parsedInput.tagIds.length,
		},
		'completed',
	);
	return parsed;
};
