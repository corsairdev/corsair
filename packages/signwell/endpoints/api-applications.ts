import type { SignwellEndpoints } from '..';
import { segment } from '../client';
import { call, deletion } from './shared';
import {
	SignwellEndpointInputSchemas as Inputs,
	SignwellEndpointOutputSchemas as Outputs,
} from './types';

export const get: SignwellEndpoints['apiApplicationsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'apiApplications.get',
			input: Inputs.apiApplicationsGet,
			output: Outputs.apiApplicationsGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/v1/api_applications/${segment(id)}`,
		}),
		{
			log: ({ id }) => ({ applicationId: id }),
		},
	);

export const remove: SignwellEndpoints['apiApplicationsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'apiApplications.delete',
			input: Inputs.apiApplicationsDelete,
			output: Outputs.apiApplicationsDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/v1/api_applications/${segment(id)}`,
		}),
		{
			shape: (raw, { id }) => deletion(raw, 'apiApplications.delete', id),
			log: ({ id }) => ({ applicationId: id }),
		},
	);
