import { makeDeeplineRequest, segment } from '../client';
import { defineEndpoint } from './common';
import {
	ExecuteToolInputSchema,
	ExecuteToolOutputSchema,
	GetToolInputSchema,
	GetToolOutputSchema,
	ListToolsInputSchema,
	ListToolsOutputSchema,
	SearchToolsInputSchema,
	SearchToolsOutputSchema,
} from './types';
export const list = defineEndpoint({
	event: 'deepline.tools.list',
	input: ListToolsInputSchema,
	output: ListToolsOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/tools`, ctx.key, {
			method: 'GET',
			query: {
				categories: input.categories,
				tags: input.tags,
				grep: input.grep,
				compact: input.compact,
				grep_mode: input.grep_mode,
			},
		}),
});
export const search = defineEndpoint({
	event: 'deepline.tools.search',
	input: SearchToolsInputSchema,
	output: SearchToolsOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/tools/search`, ctx.key, {
			method: 'GET',
			query: {
				q: input.q,
				categories: input.categories,
				search_terms: input.search_terms,
				limit: input.limit,
				offset: input.offset,
				task: input.task,
			},
		}),
});
export const get = defineEndpoint({
	event: 'deepline.tools.get',
	input: GetToolInputSchema,
	output: GetToolOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(
			`/api/v2/integrations/${segment(input.toolId)}/get`,
			ctx.key,
			{ method: 'GET' },
		),
});
export const execute = defineEndpoint({
	event: 'deepline.tools.execute',
	input: ExecuteToolInputSchema,
	output: ExecuteToolOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(
			`/api/v2/integrations/${segment(input.toolId)}/execute`,
			ctx.key,
			{
				method: 'POST',
				body: { payload: input.payload },
				headers: { 'Idempotency-Key': input.idempotencyKey },
			},
		),
});
