import type { VirustotalEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	VirustotalEndpointInputSchemas as Inputs,
	VirustotalEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Reads an analysis a scan or rescan produced. Its `status` moves from
 * `queued` to `in-progress` to `completed`, so a caller polls this rather than
 * waiting on the scan.
 */
export const get: VirustotalEndpoints['analysesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'analyses.get',
			input: Inputs.analysesGet,
			output: Outputs.analysesGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/analyses/${segment(id)}` }),
		{
			log: (_, result) => ({
				id: result.data?.id ?? undefined,
				status: result.data?.attributes?.status ?? undefined,
			}),
		},
	);
