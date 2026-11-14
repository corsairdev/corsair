import type { CloudConvertEndpoints } from '..';
import { call } from './call';
import {
	CloudConvertEndpointInputSchemas as Inputs,
	CloudConvertEndpointOutputSchemas as Outputs,
} from './types';

export const formatsListSupported: CloudConvertEndpoints['formatsListSupported'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'formats.listSupported',
				input: Inputs.formatsListSupported,
				output: Outputs.formatsListSupported,
			},
			input,
			() => ({
				method: 'GET',
				path: '/operations',
				query: {
					alternatives: true,
					include: 'options,options.details,engine_versions',
				},
			}),
			{
				auth: 'none',
				log: (_, result) => ({ count: result.data.length }),
			},
		);
