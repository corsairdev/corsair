import type { OpengraphEndpoints } from '..';
import { call } from './call';
import {
	OpengraphEndpointInputSchemas as Inputs,
	OpengraphEndpointOutputSchemas as Outputs,
} from './types';

export const run: OpengraphEndpoints['extractRun'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'extract.run',
			input: Inputs.extractRun,
			output: Outputs.extractRun,
		},
		input,
		({
			site,
			selectors,
			html_elements,
			wait_for_selector,
			scroll_to_bottom,
			load_more_selector,
			load_more_clicks,
			load_more_wait,
			...query
		}) => ({
			method: 'POST',
			path: '/3.0/extract',
			query,
			body: {
				site,
				selectors,
				html_elements,
				wait_for_selector,
				scroll_to_bottom,
				load_more_selector,
				load_more_clicks,
				load_more_wait,
			},
		}),
		{ log: ({ site }) => ({ url: site }) },
	);
