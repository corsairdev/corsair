import type { VectorshiftEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	VectorshiftEndpointInputSchemas as Inputs,
	VectorshiftEndpointOutputSchemas as Outputs,
} from './types';

export const list: VectorshiftEndpoints['pipelinesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pipelines.list',
			input: Inputs.pipelinesList,
			output: Outputs.pipelinesList,
		},
		input,
		({ include_shared, verbose }) => ({
			method: 'GET',
			path: '/pipelines',
			query: { include_shared, verbose },
		}),
		{
			log: (_, result) => ({
				count: result.object_ids?.length ?? 0,
				// Only set when verbose was asked for.
				objects: result.objects?.length ?? 0,
			}),
		},
	);

export const run: VectorshiftEndpoints['pipelinesRun'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pipelines.run',
			input: Inputs.pipelinesRun,
			output: Outputs.pipelinesRun,
		},
		input,
		({ id, inputs }) => ({
			method: 'POST',
			path: `/pipeline/${segment(id)}/run`,
			body: { inputs },
		}),
		{
			log: (parsed, result) => ({
				id: parsed.id,
				run: result.run_id ?? undefined,
				outputs: result.outputs ? Object.keys(result.outputs).length : 0,
			}),
		},
	);

/**
 * Runs the same pipeline once per entry, in parallel. Each result carries its
 * own `run_id` and outputs, so one failure does not hide the others.
 */
export const bulkRun: VectorshiftEndpoints['pipelinesBulkRun'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pipelines.bulkRun',
			input: Inputs.pipelinesBulkRun,
			output: Outputs.pipelinesBulkRun,
		},
		input,
		({ id, runs }) => ({
			method: 'POST',
			path: `/pipeline/${segment(id)}/bulk_run`,
			body: { runs },
		}),
		{
			log: (parsed, result) => ({
				id: parsed.id,
				runs: result.run_outputs?.length ?? 0,
			}),
		},
	);

/**
 * Creates a pipeline from a graph. `config` is passed through unchanged: its
 * shape belongs to the visual builder, and the API itself only requires that
 * it is present.
 */
export const create: VectorshiftEndpoints['pipelinesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pipelines.create',
			input: Inputs.pipelinesCreate,
			output: Outputs.pipelinesCreate,
		},
		input,
		({ name, description, config }) => ({
			method: 'POST',
			path: '/pipeline',
			body: { name, description, config },
		}),
		{
			log: (parsed, result) => ({
				id: result.id ?? undefined,
				name: parsed.name,
			}),
		},
	);
