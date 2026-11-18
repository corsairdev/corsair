import { makeDeeplineRequest } from '../client';
import { defineEndpoint } from './common';
import {
	GetRuntimeHealthInputSchema,
	GetRuntimeHealthOutputSchema,
} from './types';
export const get = defineEndpoint({
	event: 'deepline.health.get',
	input: GetRuntimeHealthInputSchema,
	output: GetRuntimeHealthOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/health`, ctx.key, { method: 'GET' }),
});
