import type { OpengraphEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	OpengraphEndpointInputSchemas as Inputs,
	OpengraphEndpointOutputSchemas as Outputs,
} from './types';

// Sections and questions go in a POST body; a plain request stays a GET.
// cache_ok is only read from the query string, even on a POST.
export const analyze: OpengraphEndpoints['brandAnalyze'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'brand.analyze',
			input: Inputs.brandAnalyze,
			output: Outputs.brandAnalyze,
		},
		input,
		({ url, cache_ok, include_meta, sections, questions }) => {
			const useBody = sections !== undefined || questions !== undefined;
			return {
				method: useBody ? 'POST' : 'GET',
				path: `/1.1/brand/${segment(url)}`,
				query: {
					cache_ok,
					include_meta: useBody ? undefined : include_meta,
				},
				body: useBody ? { sections, questions, include_meta } : undefined,
			};
		},
		{ log: ({ url }) => ({ url }) },
	);
