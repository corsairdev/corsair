import { makeDeeplineRequest, segment } from '../client';
import { defineEndpoint } from './common';
import {
	GetToolExecutionByKeyInputSchema,
	GetToolExecutionByKeyOutputSchema,
} from './types';
export const getByKey = defineEndpoint({
	event: 'deepline.executions.getByKey',
	input: GetToolExecutionByKeyInputSchema,
	output: GetToolExecutionByKeyOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(
			`/api/v2/executions/by-key/${segment(input.key)}`,
			ctx.key,
			{ method: 'GET' },
		),
});
