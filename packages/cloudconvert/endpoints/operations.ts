import type { CloudConvertEndpoints } from '..';
import { call, joinList } from './call';
import {
	CloudConvertEndpointInputSchemas as Inputs,
	CloudConvertEndpointOutputSchemas as Outputs,
} from './types';

export const operationsList: CloudConvertEndpoints['operationsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'operations.list',
			input: Inputs.operationsList,
			output: Outputs.operationsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/operations',
			query: {
				'filter[operation]': parsed.operation,
				'filter[input_format]': parsed.inputFormat,
				'filter[output_format]': parsed.outputFormat,
				'filter[engine]': parsed.engine,
				'filter[engine_version]': parsed.engineVersion,
				alternatives: parsed.alternatives,
				include: joinList(parsed.include),
			},
		}),
		{
			auth: 'none',
			log: (_, result) => ({ count: result.data.length }),
		},
	);
