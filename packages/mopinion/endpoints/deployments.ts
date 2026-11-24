import type { MopinionEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	MopinionEndpointInputSchemas as Inputs,
	MopinionEndpointOutputSchemas as Outputs,
} from './types';

/** Lists the deployments (feedback collection forms). */
export const list: MopinionEndpoints['deploymentsList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'deployments.list',
			input: Inputs.deploymentsList,
			output: Outputs.deploymentsList,
		},
		input,
		({ page, limit }) => ({
			method: 'GET',
			path: '/deployments',
			query: { page, limit },
		}),
	);

/** Reads one deployment. */
export const get: MopinionEndpoints['deploymentsGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'deployments.get',
			input: Inputs.deploymentsGet,
			output: Outputs.deploymentsGet,
		},
		input,
		({ deploymentId }) => ({
			method: 'GET',
			path: `/deployments/${segment(deploymentId)}`,
		}),
		{
			log: ({ deploymentId }) => ({ deploymentId }),
		},
	);
