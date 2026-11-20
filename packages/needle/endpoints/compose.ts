import type { NeedleEndpoints } from '..';
import { call } from './call';
import {
	NeedleEndpointInputSchemas as Inputs,
	NeedleEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Previews a composed message without sending it. The text is a suggestion, so
 * nothing here reaches a lead.
 */
export const preview: NeedleEndpoints['composePreview'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'compose.preview',
			input: Inputs.composePreview,
			output: Outputs.composePreview,
		},
		input,
		(body) => ({ method: 'POST', path: '/compose', body }),
		{
			log: ({ channel }, result) => ({
				channel,
				length: result.text.length,
			}),
		},
	);
