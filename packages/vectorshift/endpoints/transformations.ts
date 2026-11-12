import type { VectorshiftEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	VectorshiftEndpointInputSchemas as Inputs,
	VectorshiftEndpointOutputSchemas as Outputs,
} from './types';

/**
 * A transformation is a Python function VectorShift runs in its own sandbox.
 * The schemas describe the function's arguments and return value by name and
 * type, which is what generates its signature.
 */
export const create: VectorshiftEndpoints['transformationsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'transformations.create',
			input: Inputs.transformationsCreate,
			output: Outputs.transformationsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/transformation', body }),
		{
			log: (parsed, result) => ({
				id: result.id ?? undefined,
				name: parsed.name,
				function: parsed.function_name,
			}),
		},
	);

export const run: VectorshiftEndpoints['transformationsRun'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transformations.run',
			input: Inputs.transformationsRun,
			output: Outputs.transformationsRun,
		},
		input,
		({ id, inputs }) => ({
			method: 'POST',
			path: `/transformation/${segment(id)}/run`,
			body: { inputs },
		}),
		{
			log: (parsed, result) => ({
				id: parsed.id,
				inputs: Object.keys(parsed.inputs).length,
				result: result.result ? Object.keys(result.result).length : 0,
			}),
		},
	);
