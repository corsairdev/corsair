import type { OpengraphEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	OpengraphEndpointInputSchemas as Inputs,
	OpengraphEndpointOutputSchemas as Outputs,
} from './types';

export const capture: OpengraphEndpoints['screenshotCapture'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'screenshot.capture',
			input: Inputs.screenshotCapture,
			output: Outputs.screenshotCapture,
		},
		input,
		({ url, ...query }) => ({
			method: 'GET',
			path: `/3.0/screenshot/${segment(url)}`,
			query,
		}),
		{ log: ({ url }) => ({ url }) },
	);
